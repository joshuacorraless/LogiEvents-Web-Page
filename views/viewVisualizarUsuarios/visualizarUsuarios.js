$(document).ready(function() {
    $('#confirmDeleteBtn').click(function() {
        
        if ($('#confirmCheckbox').is(':checked')) {
            // Aquí iría la lógica para eliminar el administrador
            alert('Administrador eliminado correctamente');
            var modal = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'));
            modal.hide();
        } else {
            alert('Debes marcar la casilla para confirmar');
        }
    });
});