$(document).ready(function(){
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

    $('.c-control').click(function(){
        
        $.get($(this).attr('href')).done( (res) =>{
            $('#container').empty()
            $('#container').append(res)

            $('.table').DataTable()
        })
        return false
    })
});