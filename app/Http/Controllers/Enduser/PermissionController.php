<?php

namespace App\Http\Controllers\admin\permission;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use DB;


class PermissionController extends Controller
{
     	
	  /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $data = DB::table('permissions')->orderBy('id','DESC')->paginate(5);
        return view('admin.permission.index',compact('data'))
            ->with('i', ($request->input('page', 1) - 1) * 5);
    }
    
    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        $parentPermission=DB::table('permissions')->where('parent_id',0)->get();
        return view('admin.permission.create',compact('parentPermission'));
    }
    
    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate($request, [
            'name' => 'required|unique:permissions,name',
            'resource' => 'required',
        ]);
    
        $input =[
            'parent_id'=>$request->parent_id?$request->parent_id:0,
            'name'=>$request->name,
            'resource'=>$request->resource,
            'guard_name'=>'web'
        ]; 

         DB::table('permissions')->insert($input);
    
        return redirect()->route('permit.index')
                        ->with('success','Permission created successfully');
    }
    
    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user =  DB::table('permissions')->where('id',$id)->first();
        return view('admin.permission.show',compact('user'));
    }
    
    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $designation = DB::table('permissions')->where('id',$id)->first();

        $parentPermission=DB::table('permissions')->get();
  
        return view('admin.permission.edit',compact('designation','parentPermission'));
    }
    
    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate($request, [
            'name' => 'required|unique:permissions,name,'.$id,
            'resource' => 'required',
        ]);

        $input =[
            'parent_id'=>$request->parent_id?$request->parent_id:0,
            'name'=>$request->name,
            'resource'=>$request->resource,
            'guard_name'=>'web'
        ]; 

         DB::table('permissions')->where('id',$id)->update($input);
    
        return redirect()->route('permit.index')
                        ->with('success','Permission update successfully');
    }
    
    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Designation::find($id)->delete();
        return redirect()->route('designation.index')
                        ->with('success','Designation deleted successfully');
    }
}
