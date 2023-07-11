

 $(document).ready(function () {
    $('.filter').change(function (e) {
        console.log("XD");
        var selectedFilters = {};
        var $filterCheckboxes = $('.filter');
        $filterCheckboxes.filter(':checked').each(function() {
      
          if (!selectedFilters.hasOwnProperty(this.name)) {
            selectedFilters[this.name] = [];
          }
      
          selectedFilters[this.name].push(this.value);
      
        });
      
        // create a collection containing all of the filterable elements
        var $filteredResults = $('.trip');
      
        // loop over the selected filter name -> (array) values pairs
        $.each(selectedFilters, function(name, filterValues) {
      
          // filter each .flower element
          $filteredResults = $filteredResults.filter(function() {
      
            var matched = false,
              currentFilterValues = $(this).data('category').split(' ');
      
            // loop over each category value in the current .flower's data-category
            $.each(currentFilterValues, function(_, currentFilterValue) {
      
              // if the current category exists in the selected filters array
              // set matched to true, and stop looping. as we're ORing in each
              // set of filters, we only need to match once
      
              if ($.inArray(currentFilterValue, filterValues) != -1) {
                matched = true;
                return false;
              }
            });
      
            // if matched is true the current .flower element is returned
            return matched;
      
          });
        });
      
        $('.trip').hide().filter($filteredResults).show();
    });
});

function showDetail(ele) {
    $(document.querySelectorAll('[id = trip]')).not(this).hide();
    $(document.getElementsByClassName(ele)).show();


}

function just_hide(ele) {
    $(document.getElementsByClassName(ele)).hide();
}











$filterCheckboxes.on('change', function() {
    console.log("xd")

 

});






