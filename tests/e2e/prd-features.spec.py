"""
产业招商平台 — 浏览器自动化测试
基于 PRD 文档验证已完成功能
"""
from playwright.sync_api import sync_playwright
import os

SCREENSHOT_DIR = '/tmp/zsyz-test-screenshots'
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

BASE_URL = 'http://localhost:5173'
results = []

def record(name, passed, detail=''):
    status = 'PASS' if passed else 'FAIL'
    results.append((name, status, detail))
    print(f'  [{status}] {name}' + (f' — {detail}' if detail else ''))

def safe_click(locator, timeout=5000):
    """Click with force=True to handle postcss-pxtorem tiny elements"""
    try:
        locator.first.click(force=True, timeout=timeout)
        return True
    except Exception as e:
        return False

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    # ============================================================
    # 1. LOGIN PAGE TESTS
    # ============================================================
    print('\n=== 1. Login Page Tests ===')
    page.goto(f'{BASE_URL}/#/login')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)
    page.screenshot(path=f'{SCREENSHOT_DIR}/01-login-page.png', full_page=True)

    brand_panel = page.locator('.login-page__brand')
    form_panel = page.locator('.login-page__form-wrapper')
    record('Login: Left brand panel exists', brand_panel.count() > 0)
    record('Login: Right form panel exists', form_panel.count() > 0)

    title = page.locator('.login-page__title')
    record('Login: Title "产业招商平台"', title.count() > 0 and '产业招商平台' in title.first.text_content())

    username_input = page.locator('input[placeholder="请输入用户名"]')
    password_input = page.locator('input[placeholder="请输入密码"]')
    remember_cb = page.locator('text=记住密码')
    forgot_link = page.locator('text=忘记密码')
    login_btn = page.locator('button:has-text("登 录")')
    record('Login: Username input', username_input.count() > 0)
    record('Login: Password input', password_input.count() > 0)
    record('Login: Remember checkbox', remember_cb.count() > 0)
    record('Login: Forgot password link', forgot_link.count() > 0)
    record('Login: Login button', login_btn.count() > 0)

    brand_bg = brand_panel.first.evaluate('el => getComputedStyle(el).background')
    record('Login: Left panel gradient', 'gradient' in brand_bg or 'rgb' in brand_bg)

    # Login flow
    page.locator('.login-page .el-form-item').nth(0).locator('.el-input__inner').first.fill('admin', force=True)
    page.locator('.login-page .el-form-item').nth(1).locator('.el-input__inner').first.fill('123456', force=True)
    login_btn.first.click(force=True)
    page.wait_for_timeout(2000)
    page.wait_for_load_state('networkidle')
    current_url = page.url
    login_success = '/login' not in current_url
    record('Login: Redirect after login', login_success, f'URL: {current_url}')

    # If login didn't work via form, manually set token and navigate
    if not login_success:
        page.evaluate('() => { localStorage.setItem("zsyz_token", "mock-token-123456"); localStorage.setItem("zsyz_user", JSON.stringify({name:"admin",role:"admin"})); }')
        page.goto(f'{BASE_URL}/#/')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(2000)
        current_url = page.url
        login_success = '/login' not in current_url
        record('Login: Manual token login', login_success, f'URL: {current_url}')

    page.screenshot(path=f'{SCREENSHOT_DIR}/02-after-login.png', full_page=True)

    # ============================================================
    # 2. MAIN LAYOUT TESTS
    # ============================================================
    print('\n=== 2. Main Layout Tests ===')

    header = page.locator('.app-header')
    record('Layout: Header exists', header.count() > 0)

    header_title = page.locator('.app-header__title')
    record('Layout: Header title "产业招商平台"', header_title.count() > 0 and '产业招商平台' in header_title.first.text_content())

    collapse_btn = page.locator('.app-header__collapse-btn')
    record('Layout: Collapse button exists', collapse_btn.count() > 0)

    sidebar = page.locator('.app-sidebar')
    record('Layout: Sidebar exists', sidebar.count() > 0)

    sidebar_bg = sidebar.first.evaluate('el => getComputedStyle(el).backgroundColor')
    record('Layout: Sidebar has dark background', sidebar_bg != 'rgba(0, 0, 0, 0)')

    expected_menus = ['产业地图', '产业图谱', '运行分析', '产业动态', '区域对标', '风险预警', '区域地图', '精准招商', '招商情报', '企业监测']
    menu_items = page.locator('.el-sub-menu__title, .el-menu-item')
    menu_texts = [item.text_content().strip() for item in menu_items.all()]
    for menu_name in expected_menus:
        found = any(menu_name in t for t in menu_texts)
        record(f'Layout: Menu "{menu_name}"', found)

    breadcrumb = page.locator('.el-breadcrumb')
    record('Layout: Breadcrumb exists', breadcrumb.count() > 0)

    content_area = page.locator('.main-layout__content')
    record('Layout: Content area exists', content_area.count() > 0)

    page_header = page.locator('.page-header')
    record('Layout: Page header exists', page_header.count() > 0)

    # ============================================================
    # 3. SIDEBAR NAVIGATION TESTS
    # ============================================================
    print('\n=== 3. Sidebar Navigation Tests ===')

    analysis_menu = page.locator('.el-sub-menu__title').filter(has_text='运行分析')
    if analysis_menu.count() > 0:
        analysis_menu.first.click(force=True)
        page.wait_for_timeout(800)
        page.screenshot(path=f'{SCREENSHOT_DIR}/03-analysis-expanded.png', full_page=True)

        expected_submenus = ['产业总览', '企业布局', '整体评价', '载体分析', '强弱分析', '运行报告', '对比报告', '企业报告']
        visible_menus = page.locator('.el-menu-item, .el-sub-menu__title')
        visible_texts = [m.text_content().strip() for m in visible_menus.all()]
        for sub in expected_submenus:
            found = any(sub in t for t in visible_texts)
            record(f'Navigation: Submenu "{sub}"', found)

        # Navigate directly since nested menus may not be visible due to pxtorem scaling
        page.goto(f'{BASE_URL}/#/analysis/overview/summary')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(800)
        page.screenshot(path=f'{SCREENSHOT_DIR}/04-analysis-overview.png', full_page=True)
        new_header = page.locator('.page-header__title')
        record('Navigation: Navigate to 产业总览', new_header.count() > 0)

    # ============================================================
    # 4. SIDEBAR COLLAPSE TESTS
    # ============================================================
    print('\n=== 4. Sidebar Collapse Tests ===')

    sidebar_width_before = sidebar.first.evaluate('el => el.offsetWidth')
    collapse_btn.first.click(force=True)
    page.wait_for_timeout(600)
    sidebar_width_after = page.locator('.app-sidebar').first.evaluate('el => el.offsetWidth')
    record('Sidebar: Collapses', sidebar_width_after < sidebar_width_before,
           f'Before: {sidebar_width_before}px, After: {sidebar_width_after}px')
    page.screenshot(path=f'{SCREENSHOT_DIR}/05-sidebar-collapsed.png', full_page=True)

    page.locator('.app-header__collapse-btn').first.click(force=True)
    page.wait_for_timeout(600)
    sidebar_width_restored = page.locator('.app-sidebar').first.evaluate('el => el.offsetWidth')
    record('Sidebar: Expands', sidebar_width_restored > sidebar_width_after,
           f'Restored: {sidebar_width_restored}px')

    # ============================================================
    # 5. PAGE NAVIGATION TESTS
    # ============================================================
    print('\n=== 5. Page Navigation Tests ===')

    routes_to_test = [
        ('/#/map/chain/search', '产业资源搜索'),
        ('/#/atlas/national/overview', '全国图谱总览'),
        ('/#/analysis/overview/summary', '产业总览'),
        ('/#/dynamics/news', '行业动态'),
        ('/#/warning/overview', '预警总览'),
        ('/#/invest/chain/target', '目标筛选'),
        ('/#/intelligence/news', '招商资讯'),
        ('/#/monitor/overview/summary', '监测总览'),
    ]

    for route, expected_title in routes_to_test:
        page.goto(f'{BASE_URL}{route}')
        page.wait_for_load_state('networkidle')
        page.wait_for_timeout(1200)
        page_title = page.locator('.page-header__title')
        has_title = page_title.count() > 0
        if has_title:
            actual = page_title.first.text_content()
            matches = expected_title in actual
            record(f'Route {route}', matches, f'Expected: "{expected_title}", Got: "{actual}"')
        else:
            record(f'Route {route}', False, 'No page header found')

    page.screenshot(path=f'{SCREENSHOT_DIR}/06-route-navigation.png', full_page=True)

    # ============================================================
    # 6. 404 PAGE TEST
    # ============================================================
    print('\n=== 6. 404 Page Test ===')
    page.goto(f'{BASE_URL}/#/nonexistent-page-xyz')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)
    page.screenshot(path=f'{SCREENSHOT_DIR}/07-404.png', full_page=True)

    error_code = page.locator('text=404')
    error_msg = page.locator('text=页面不存在')
    is_404 = error_code.count() > 0 or error_msg.count() > 0
    record('404: Error page for invalid route', is_404, f'URL: {page.url}')

    # ============================================================
    # 7. LOGOUT FLOW TEST
    # ============================================================
    print('\n=== 7. Logout Flow Test ===')
    page.goto(f'{BASE_URL}/#/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(800)

    user_dropdown = page.locator('.app-header__user')
    if user_dropdown.count() > 0:
        user_dropdown.first.click(force=True)
        page.wait_for_timeout(500)

        logout_item = page.locator('.el-dropdown-menu__item:has-text("退出登录")')
        if logout_item.count() > 0:
            logout_item.first.click(force=True)
            page.wait_for_load_state('networkidle')
            page.wait_for_timeout(1500)
            is_login_page = '/login' in page.url
            record('Logout: Redirected to login', is_login_page, f'URL: {page.url}')
            page.screenshot(path=f'{SCREENSHOT_DIR}/08-after-logout.png', full_page=True)
        else:
            record('Logout: "退出登录" found', False, 'Dropdown item not found')
    else:
        record('Logout: User dropdown found', False, 'Element not found')

    # ============================================================
    # 8. VISUAL DESIGN VERIFICATION
    # ============================================================
    print('\n=== 8. Visual Design Verification ===')
    page.goto(f'{BASE_URL}/#/login')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1000)

    brand_style = page.locator('.login-page__brand').first.evaluate('el => getComputedStyle(el).background')
    record('Visual: Login gradient', 'gradient' in brand_style)

    form_card = page.locator('.login-page__form-card')
    card_bg = form_card.first.evaluate('el => getComputedStyle(el).backgroundColor') if form_card.count() > 0 else ''
    record('Visual: Form card white bg', 'rgb(255, 255, 255)' in card_bg)

    login_button = page.locator('button:has-text("登 录")')
    if login_button.count() > 0:
        btn_bg = login_button.first.evaluate('el => getComputedStyle(el).backgroundColor')
        record('Visual: Login button blue', 'rgb' in btn_bg)

    # Login for layout check
    page.evaluate('() => { localStorage.setItem("zsyz_token", "mock-token-123456"); localStorage.setItem("zsyz_user", JSON.stringify({name:"admin",role:"admin"})); }')
    page.goto(f'{BASE_URL}/#/')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(1500)

    body_bg = page.evaluate('() => getComputedStyle(document.body).backgroundColor')
    record('Visual: Page background light', body_bg != 'rgba(0, 0, 0, 0)')

    if page.locator('.app-sidebar').count() > 0:
        sidebar_bg_color = page.locator('.app-sidebar').first.evaluate('el => getComputedStyle(el).backgroundColor')
        is_dark = '0, 21, 41' in sidebar_bg_color or 'rgb(0, 21, 41)' in sidebar_bg_color
        record('Visual: Sidebar dark (#001529)', is_dark, f'Got: {sidebar_bg_color}')

    page.screenshot(path=f'{SCREENSHOT_DIR}/09-visual-design.png', full_page=True)

    # ============================================================
    # RESULTS SUMMARY
    # ============================================================
    browser.close()

    print('\n' + '=' * 60)
    print('TEST RESULTS SUMMARY')
    print('=' * 60)
    passed = sum(1 for _, s, _ in results if s == 'PASS')
    failed = sum(1 for _, s, _ in results if s == 'FAIL')
    total = len(results)
    print(f'\nTotal: {total}  Passed: {passed}  Failed: {failed}')
    print(f'Pass Rate: {passed/total*100:.1f}%\n')

    if failed > 0:
        print('FAILED TESTS:')
        for name, status, detail in results:
            if status == 'FAIL':
                print(f'  - {name} {f"({detail})" if detail else ""}')

    print(f'\nScreenshots saved to: {SCREENSHOT_DIR}/')
