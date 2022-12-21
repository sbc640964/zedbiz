<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('_forms_', function (Blueprint $table) {
            $table->id();
            $table->foreignId('collection_id')
                ->nullable()
                ->constrained('_collections_');
            $table->string('name');
            $table->string('description')->nullable();
            $table->json('settings')->nullable();
            $table->json('fields')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('_forms_');
    }
};
