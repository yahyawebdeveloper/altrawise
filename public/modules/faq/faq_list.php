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
         
         <div class="col-sm-12" id="faq_list_div">
            <div class="panel panel-grape">
               <div class="panel-heading">
                  <h4>FAQ List</h4>
                  &nbsp;&nbsp;<span id="total_faq_list" class="badge badge-warning">0</span>
               </div>
               <div class="panel-body">
                  <table class="table" id="tbl_view_list">
                     <thead>
                        <tr>
                           <th>#</th>
                           <th>Question Category</th>
                           <th>Employee Category</th>
                           <th>Question/Answer</th>
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