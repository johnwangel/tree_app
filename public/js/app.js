(function ($){
  $(document).ready(function() {
    $("#org").jOrgChart();
    $(".person-top").click(showParents);
    $(".person-bottom").click(showSiblings);

    function showParents(){
      console.log('show parents');
    }
    function showSiblings(){
      console.log('show siblings');
    }
    function showChildren(){
      console.log('show children');
    }
    function showExtendedRelations(){
      console.log('show extended relations');
    }

  });
}
)(jQuery);
