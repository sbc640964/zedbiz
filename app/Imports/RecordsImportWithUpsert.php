<?php

namespace App\Imports;

use App\Models\Collection;
use App\Services\Column;
use Illuminate\Database\Eloquent\Model;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithUpsertColumns;
use Maatwebsite\Excel\Concerns\WithUpserts;

class RecordsImportWithUpsert extends RecordsImportValidation implements WithUpserts,WithUpsertColumns
{
    public function upsertColumns()
    {
        // TODO: Implement upsertColumns() method.
    }

    public function uniqueBy()
    {
        // TODO: Implement uniqueBy() method.
    }
}
