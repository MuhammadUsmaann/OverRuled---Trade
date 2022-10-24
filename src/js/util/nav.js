var initializeNav = function () {
    // expand & collapse nav menu
    let menu_expanded = false;

    $('#expand_item, #search_item, #item_hamburger').on('click', () => {

        menu_expanded = !menu_expanded;

        if (menu_expanded) {

            $('#tb_menu').removeClass('collapsed').addClass('expanded');
        }
        else {
            $('#tb_menu').removeClass('expanded').addClass('collapsed');
        }

    });



    // profile actions dropdown
    let dropdown_visible = false;

    $('#profile_img').on('click', () => {

        dropdown_visible = !dropdown_visible;

        if (dropdown_visible) {
            $('#profile_actions_close').css('display', 'block');
            $('#profile_actions_dropdown').show(200);
        }
        else {
            $('#profile_actions_close').css('display', 'none');
            $('#profile_actions_dropdown').hide(200);
        }
    });

    $('#profile_actions_close, #profile_actions_dropdown a').on('click', () => {
        dropdown_visible = false;
        $('#profile_actions_close').css('display', 'none');
        $('#profile_actions_dropdown').hide(200);
    });



    // Overlays
    $('.show-dialog').on('click', (e) => {
        let target = $(e.target).attr('data-target');

        $('.tb-dialog, .tb-overlay-step').hide();
        $('#tb_overlay').show();
        $(target).show();
    });

    $('#dialog_close, .dialog-close').on('click', () => {
        $('#tb_overlay').hide();
    });

};

module.exports = {
    initializeNav: initializeNav
};