<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('_lists_', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')->constrained('_collections_')->cascadeOnDelete();
            $table->string('type')->default('table');
            $table->string('query_mode')->default('default');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('slug');
            $table->json('columns')->nullable();
            $table->json('settings')->nullable();
            $table->json('permissions')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('lists');
    }
};
