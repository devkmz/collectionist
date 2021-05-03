<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateElementsAttributesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('elements_attributes', function (Blueprint $table) {
            $table->bigInteger('element_id')->unsigned();
            $table->bigInteger('attribute_id')->unsigned();
            $table->string('value');
            $table->timestamp('createdAt')->default(\DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('updatedAt')->default(\DB::raw('CURRENT_TIMESTAMP'));

            $table->primary(['element_id', 'attribute_id']);

            $table->foreign('element_id')->references('id')->on('collection_elements')
                ->onUpdate('restrict')
                ->onDelete('cascade');
            $table->foreign('attribute_id')->references('id')->on('collection_type_attributes')
                ->onUpdate('restrict')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('elements_attributes');
    }
}
