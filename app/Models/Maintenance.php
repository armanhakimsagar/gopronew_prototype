<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Maintenance extends Model
{
    protected $connection;

    public function __construct()
    {
        $this->connection = \Session::get('my_db_connection');
        //echo $this->connection;
    }
}
