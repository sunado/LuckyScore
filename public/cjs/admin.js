//global store current view name
var subView

$(document).ready(function(){

    //Delete User request
    var trs = null
    $('.container-fluid').on('click','.btn-danger', () => {
        console.log(this.activeElement)
        trs = this.activeElement
        $.post('/deleteUser',{
            id: $(this.activeElement).attr('id')
        }).done(function(res){
            if(res){
                var datatable = $('#dataTable').DataTable()

                datatable.row($(trs).closest("tr")).remove().draw()
            }
        })
    })

    //Add User request
    $('.submitBtn').click( () => {
        nid = $('#id').val()
        nname = $('#name').val()
        if (nid !== "" && nname !== ""){
            $.post('/addUser',{
            id: nid,
            name:nname
             }).done( (res) => {
                if(res.error){
                    alert("Get data false")
                } else {
                    $('#adduserModal').modal('toggle')
                    $('#container').empty()
                    $('#container').append(res)
                    $('.table').DataTable().draw
                }
            })
        }
    })

    //Ajax load view
    $('.c-control').click(function(){
        if(subView !== $(this).data('value')){
            var control = this
            $.get($(this).attr('href')).done( (res) =>{
                $('#container').empty()
                $('#container').append(res)
                $('.table').DataTable()
                subView = $(control).data('value') /*** */
            })
        }
        return false
    })

    //default load dashboard
    $.get('/admin/dasbhoard').done ( (res) => {
        $('#container').empty()
        $('#container').append(res)
        $('.table').DataTable()
        subView = "dashboard"
    })
    
    //send change status
    $('.container-fluid').on('click','.change-status', () => {
        var status = $('.change-status').data('value');
        if( status == "Cancel") {
            alert("Cancel")
        } else {
            alert("start")
        }
    })
});
// Ajax done
$(document).ajaxStop( () => {
    switch (subView) {
        case "dashboard":
            console.log("d")
            break;
        case "users":
            console.log("u")
            break;
        case "status":
            console.log("s")
            break;
    }
})

function setupStatus(){
    
}