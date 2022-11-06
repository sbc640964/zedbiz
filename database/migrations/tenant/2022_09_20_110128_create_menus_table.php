<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('_menus_', function (Blueprint $table) {
            $table->id();
            $table->boolean('is_active')->default(true);
            $table->string('label');
            $table->string('description')->nullable();
            $table->json('items')->nullable();
            $table->string('type')->default('main');
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('menus');
    }
};
