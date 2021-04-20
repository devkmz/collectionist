<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollectionTypesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('collection_types', function (Blueprint $table) {
            $table->id();
            $table->string('typeName');
            $table->timestamp('createdAt')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updatedAt')->default(\DB::raw('CURRENT_TIMESTAMP'));
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('collection_types');
    }
}
