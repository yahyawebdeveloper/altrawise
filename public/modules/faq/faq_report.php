<?php
   /**
   * 
   *
   * index.php
   *
   * @author: Jamal
   * @version: 1.0 - created
   */
   $current_path = '../../';
   include $current_path . 'header.php';
   ?>
<div id="page-content">
   <div id='wrap'>
      <div id="page-heading">
      </div>
      <div class="container">
         <h2><i class="fa fa-globe"></i> FAQ</h2>
         <!-- New div -->
         <div class="row" id="new_div" style="display: none">
            <div class="col-md-12">
               <div class="panel panel-primary">
                  <div class="panel-heading">
                     <h4 class="panel-title">Add new FAQ</h4>
                     <div class="options">
                        <a href="#" id="btn_hide" class="btn-panel-opts" title="Back to list">
                        <i class="fa fa-arrow-circle-left fa-lg fa-fw" aria-hidden="true"></i>
                        <span class="hidden-xs">Back to list</span>
                        </a>
                     </div>
                  </div>
                  <!--   <div class="panel panel-grape"> -->
                  <div class="panel-body">
                     <form class="form-horizontal" data-validate="parsley" id="detail_form">
                        <label for="txt_answer" class="col-sm-2 control-label">Question Category <span class="mandatory">*</span></label>
                        <div class="col-sm-10 error-container">
                           <div class="form-group">
                              <select id="dd_question_category" style="width:100%" class="populate" required="required">
                                 <option value="">Select</option>
                              </select>
                           </div>
                        </div>
                        <div class="clearfix"></div>
                        <label for="txt_answer" class="col-sm-2 control-label">Employee Category <span class="mandatory">*</span></label>
                        <div class="col-sm-10 error-container ms-error">
                           <div class="form-group">
                              <select id="dd_faq" style="width:100%" multiple required="required">
                              </select>
                           </div>
                        </div>
                        <label for="txt_answer" class="col-sm-2 control-label">Approver <span class="mandatory">*</span></label>
                        <div class="col-sm-10 error-container">
                           <div class="form-group">
                              <select id="dd_approver" style="width:100%" class="populate" required="required">
                                 <option value="">Select</option>
                              </select>
                           </div>
                        </div>
                        <label for="txt_question" class="col-sm-2 control-label">Question <span class="mandatory">*</span></label>
                        <div class="col-sm-10 error-container">
                           <div class="form-group">
                              <!--      <div class="col-md-12" contenteditable="true" id="text_editor"></div>  -->  
                              <textarea class="form-control marginBottom10px" id="txt_question" required="required"></textarea>
                           </div>
                        </div>
                        <div class="clearfix"></div>
                        <label for="txt_answer" class="col-sm-2 control-label">Answer</label>
                        <div class="col-sm-10">
                           <div class="form-group">
                              <textarea class="form-control marginBottom10px" id="text_editor" ></textarea>
                           </div>
                        </div>
                        <label id="lbl_upload" class="col-sm-2 control-label">Attachments</label>
                        <div class="col-sm-4">
                            <span class="btn btn-success fileinput-button" id="btn_add_image">
                                <span>Browse File</span>
                                <input id="doc_upload" type="file" name="files[]" data-extension="<?php echo(constant('FILEUPLOAD_ALLOWED_TYPE'));?>">
                            </span>
                            <br/>
                        </div>
                        <div class="form-group">
                           <div id="files" class="col-sm-10 col-sm-offset-2"></div>
                        </div>
                        <p class="pull-right">
                        <div class="btn-toolbar" style="text-align:right">
                           <a href="#" class="btn btn-default" id="btn_reset"><i class="fa fa-times"></i> Reset</a>
                           <a href="#" class="btn btn-primary-alt ladda-button" data-style="expand-left" data-spinner-color="#000000" id="btn_save"><i class="fa  fa-save"></i> Save</a>
                        </div>
                        </p>
                     </form>
                  </div>
                  <!--           </div> -->
               </div>
            </div>
         </div>
         <!-- New div -->
         
         <div class="col-md-12" id="search_div">
            <div class="panel panel-grape">
               <div class="panel-heading">
                  <h4>Search</h4>
                  <div class="options">
                     <a href="javascript:;" class="panel-collapse"><i class="fa fa-chevron-down"></i></a>
                  </div>
               </div>
               <div class="panel-body" style="display: none">
                  <form class="form-horizontal" data-validate="parsley" id="detail_form">
                     <div class="form-group">
                        <label class="col-sm-2 control-label xs-margin-top-10">Question Category</label>
                        <div class="col-sm-4">
                           <select id="search_question_category" style="width:100%" class="populate filter-change">
                              <option value=""></option>
                           </select>
                        </div>
                        <label class="col-sm-2 control-label xs-margin-top-10">Employee Category</label>
                        <div class="col-sm-4">
                           <select id="search_category" style="width:100%" class="populate filter-change">
                              <option value=""></option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-sm-2 control-label xs-margin-top-10">Approver</label>
                        <div class="col-sm-4">
                           <select id="search_approver" style="width:100%" class="populate filter-change">
                              <option value=""></option>
                           </select>
                        </div>
                        <label class="col-sm-2 control-label xs-margin-top-10">Status</label>
                        <div class="col-sm-4">
                           <select id="search_status" style="width:100%" class="populate filter-change">
                              <option value="">All</option>
                              <option value="1">Approved</option>
                              <option value="0">Pending</option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-sm-2 control-label xs-margin-top-10">Date</label>
                        <div class="col-sm-4">
                           <button class="btn btn-default" id="dp_date" style="width: 100%;">
                           <i class="fa fa-calendar-o fa-fw"></i>
                           <span class="hidden-xs hidden-sm hidden-md"><?php echo date("F j, Y", strtotime('-30 day')); ?> - <?php echo date("F j, Y"); ?></span> <b class="caret"></b>
                           <input type="hidden" id="from_date" value="<?php echo date("Y-m-d", strtotime('-30 day')); ?>">
                           <input type="hidden" id="to_date" value="<?php echo date("Y-m-d"); ?>">
                           </button>
                        </div>
                        <label class="col-sm-2 control-label xs-margin-top-10">Created By</label>
                        <div class="col-sm-4">
                           <select id="search_created_by" style="width:100%" class="populate" required="required">
                              <option value=""></option>
                           </select>
                        </div>
                     </div>
                     <div class="form-group">
                        <label class="col-sm-2 control-label xs-margin-top-10">Question</label>
                        <div class="col-sm-10">
                           <input class="form-control filter-change" id="search_question">
                        </div>
                     </div>
                     <div class="form-group">
                        <div class="btn-toolbar text-right" style="padding-right: 10px;">
                           <button type="button" class="btn btn-default" id="btn_search_reset"><i class="fa fa-times"></i> Reset</button>
                           <button type="button" class="btn btn-primary-alt" id="btn_search"><i class="fa fa-search fa-fw"></i>Search</button>
                        </div>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <div class="col-sm-12" id="col-sm12_div">
            <div class="panel panel-grape">
               <div class="panel-heading">
                  <h4>FAQ Report</h4>
                  &nbsp;&nbsp;<span id="total_faq_report" class="badge badge-warning">0</span>
                  <div class="options">
                     <a href="#" class="btn-panel-opts" title="New FAQ" id="btn_new">
                     <i class="fa fa-plus fa-fw" aria-hidden="true"></i>
                     <span class="hidden-xs">New FAQ</span>
                     </a>
                  </div>
               </div>
               <div class="panel-body">
                  <table class="table" id="tbl_faq_report">
                     <thead>
                        <tr>
                           <th>#</th>
                           <th>Question Category</th>
                           <th>Employee Category</th>
                           <th>Question</th>
                           <th>Created By</th>
                           <th>Approver</th>
                           <th>Status</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
      <!-- container -->
   </div>
   <!--wrap -->
</div>
<!-- page-content -->
<?php include $current_path . "footer.php" ?>