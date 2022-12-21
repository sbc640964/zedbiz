<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('_widgets_', function (Blueprint $table) {
            $table->id();
            $table->foreignId('page_id')->nullable()->constrained('_pages_');
            $table->string('name');
            $table->string('description')->nullable();
            $table->string('type');
            $table->json('settings')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('_widgets_');
    }
};
