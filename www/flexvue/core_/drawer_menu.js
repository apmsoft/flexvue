// contents
const DrawerNavigation = {
    version: '0.8',
    // 메뉴오픈
    drawer_menu_opened: function() {
        // make url
        UrlUtil.pushUrlParams({mode : 'drawer_menu'});
        let url_param = Object.entries(params).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join("&");
        UrlUtil.pushState(UrlUtil._url_params, '', `${app.service_root_dir}/?${url_param}`);

        document.querySelector("#drawer_menu").classList.toggle('drawer_transitioned');
    },

    // 메뉴닫기
    drawer_menu_closed: function() {
        document.querySelector("#drawer_menu").classList.remove('drawer_transitioned');
    }
};
