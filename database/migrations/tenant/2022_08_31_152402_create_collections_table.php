<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('_collections_', function (Blueprint $table) {

            $table->id();
            $table->string('name');
            $table->string('slug')->unique();

            $table->string('description')->nullable();
            $table->json('settings')->nullable();
            $table->json('columns')->nullable();
            $table->json('custom_attributes')->nullable();
            $table->json('permissions')->nullable();
            $table->json('workflows')->nullable();
            $table->string('table_name')->nullable();
            $table->string('model_name')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('_collections_');
    }
};
