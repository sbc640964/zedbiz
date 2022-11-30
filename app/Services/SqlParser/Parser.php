<?php

namespace App\Services\SqlParser;

use Illuminate\Database\Query\JoinClause;
use PhpMyAdmin\SqlParser\Parser as BaseParser;
use PhpMyAdmin\SqlParser\Statement;
use PhpMyAdmin\SqlParser\Utils\Query;

class Parser
{
    private string $sql;
    private $query;

    public function __construct($sql)
    {
        $this->sql = $sql;
        $this->query = \DB::query();
    }

    public function getQuery(): \Illuminate\Database\Query\Builder
    {
        return $this->query;
    }

    static function make($sql): Parser
    {
        $parser = new self($sql);
        $parser->parse();
        return $parser;
    }

    public function parse()
    {
        $parser = new BaseParser($this->sql);
        //        $flags = Query::getFlags($parser->statements[0]);
        $this->select($parser->statements[0]->expr);
        $this->from($parser->statements[0]->from);
        $this->join($parser->statements[0]->join);
        $this->where($parser->statements[0]->where);
        $this->groupBy($parser->statements[0]->group);

        $this->orderBy($parser->statements[0]->order);

        return $this;

    }

    function validate()
    {
    }

    public function select($expr): void
    {
        foreach ($expr as $item) {
            if($item->subquery && !\Str::startsWith($item->expr, '((')) {
                $this->parseSubQuery($item, 'select');
            } else {
                match ($item->function) {
                    null => $this->query->addSelect($item->expr . ($item->alias ? ' as ' . $item->alias : '')),
                    default => $this->query->selectRaw($item->expr . ($item->alias ? ' as ' . $item->alias : '')),
                };
            }
        }
    }

    public function from($from): void
    {
        foreach ($from as $item) {
            if($item->subquery) {
                $this->parseSubQuery($item, 'from');
            } else {
                $this->query->from($item->expr);
            }
        }
    }

    public function join($join): void
    {
        if(!$join) return;

        foreach ($join as $item) {
            if($item->expr->subquery) {
                $this->parseSubQuery($item, 'join');
            } else {
                if($item->type === 'CROSS') {
                    $this->query->crossJoin($item->expr);
                    return;
                }

                $method = match ($item->type) {
                    'LEFT' => 'leftJoin',
                    'RIGHT' => 'rightJoin',
                    default => 'join',
                };

                $on = \Str::of($item->on[0]->expr)->trim()->replace(' ', '');

                $this->query->$method($this->getText($item->expr), function(JoinClause $join) use ($on, $item) {

                    $operator = $this->getOperator($on);

                    $join->on($on->before($operator), $operator, $on->after($operator));

//                    if(count($item->on) > 1){
//                        $andOr = null;
//                        $offcet = null;
//                        collect($item->on)->slice(1)->each(function($on, $index) use (&$andOr, $item, $join, &$offcet) {
//                            if($on->isOperator){
//                                $andOr = $on->expr;
//                                return;
//                            }
//
//                            $on = \Str::of($on->expr)->trim()->replace(' ', '');
//
//                            if($on->startsWith('(')){
//                                $join->on(fn($join) => $this->nestedOn($join, $item, $index, $andOr));
//                            }
//
//                            $operator = $this->getOperator($on);
//
//                            $join->{$andOr === 'OR' ? 'orOn' : 'on'}($on->before($operator), $operator, $on->after($operator));
//                        });
//                    }
                });
            }
        }
    }

    function getOperator($on): string
    {
        return match (true){
            $on->contains('>') => '>',
            $on->contains('<') => '<',
            $on->contains('>=') => '>=',
            $on->contains('<=') => '<=',
            default => '=',
        };
    }

    function nestedOn($join, $item, $index, $andOr){
        //todo
    }

    private function parseSubQuery(mixed $item, $type): void
    {
        $subQuery = Parser::make($item->expr);

        match ($type) {
            'select' => $this->query->selectSub($subQuery->getQuery(), $item->alias),
            'from' => $this->query->fromSub($subQuery->getQuery(), $item->alias),
            'join' => $this->query->joinSub($subQuery->getQuery(), $item->alias, function(JoinClause $join) use ($item) {
                $join->on($item->on[0]->expr, '=', $item->on[1]->expr);
            }),
        };
    }

    private function getText($item): string
    {
        $text = $item->table;

        if($item->column) {
            $text .= '.' . $item->column;
        }

        if($item->alias) {
            $text .= ' as ' . $item->alias;
        }

        return $text;
    }

    private function where($where): void
    {
        if(!$where) return;

        $whereRaw = collect($where)->pluck('expr')->join(' ');
        $this->query->whereRaw($whereRaw);
    }

    private function groupBy($group): void
    {
        if(!$group) return;

        $groupByRaw = collect($group)->pluck('expr.expr')->flatten()->join(', ');
        $this->query->groupByRaw($groupByRaw);
    }

    private function orderBy($order): void
    {
        if(!$order) return;

        $orderBy = collect($order)->mapWithKeys(fn($item) => [$item->type => $item->expr->expr]);
        $orderBy->each(fn($item, $key) => $this->query->orderBy($item, $key));
    }
}
