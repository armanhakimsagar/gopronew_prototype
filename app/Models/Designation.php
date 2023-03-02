<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;

class Designation extends Model
{
    use HasFactory;

    public $timestamps = true;

    public function department(){
      return $this->belongsTo(Role::class);
    }
}
