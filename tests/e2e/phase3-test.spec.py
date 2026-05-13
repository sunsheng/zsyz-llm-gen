"""
Phase 3 功能测试 - 产业招商平台
测试模块: 产业地图(9页) + 产业图谱(8页) + 运行分析(25页) = 42页
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"
SCREENSHOT_DIR = "/tmp/phase3-test-screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# === Test Routes ===
MAP_ROUTES = [
    ("/map/chain/search", "产业资源搜索", "map"),
    ("/map/chain/filter", "产业资源筛选", "map"),
    ("/map/chain/layers", "产业图层切换", "map"),
    ("/map/chain/space", "产业空间分布", "map"),
    ("/map/chain/clusters", "产业集群分布", "map"),
    ("/map/supply/overview", "供应链总览", "map"),
    ("/map/supply/detail", "供应链详情", "map"),
    ("/map/tech/overview", "技术链总览", "map"),
    ("/map/tech/detail", "技术链详情", "map"),
]

ATLAS_ROUTES = [
    ("/atlas/national/overview", "全国图谱总览", "atlas"),
    ("/atlas/national/chain", "产业链图谱", "atlas"),
    ("/atlas/national/relation", "企业关系图谱", "atlas"),
    ("/atlas/national/tech", "技术图谱", "atlas"),
    ("/atlas/regional/overview", "区域图谱总览", "atlas"),
    ("/atlas/regional/chain", "区域产业链图谱", "atlas"),
    ("/atlas/regional/relation", "区域关系图谱", "atlas"),
    ("/atlas/regional/compare", "区域对比图谱", "atlas"),
]

ANALYSIS_ROUTES = [
    ("/analysis/overview/summary", "产业总览", "analysis"),
    ("/analysis/overview/trend", "发展趋势", "analysis"),
    ("/analysis/overview/structure", "产业结构", "analysis"),
    ("/analysis/overview/contribution", "贡献分析", "analysis"),
    ("/analysis/layout/region", "区域布局", "analysis"),
    ("/analysis/layout/industry", "行业布局", "analysis"),
    ("/analysis/evaluation/comprehensive", "综合评价", "analysis"),
    ("/analysis/evaluation/competitiveness", "竞争力评价", "analysis"),
    ("/analysis/evaluation/innovation", "创新力评价", "analysis"),
    ("/analysis/evaluation/efficiency", "效率评价", "analysis"),
    ("/analysis/evaluation/potential", "潜力评价", "analysis"),
    ("/analysis/carrier/park", "园区分析", "analysis"),
    ("/analysis/carrier/platform", "平台分析", "analysis"),
    ("/analysis/carrier/incubator", "孵化器分析", "analysis"),
    ("/analysis/strength/snapshot", "强弱快照", "analysis"),
    ("/analysis/strength/detail", "强弱详情", "analysis"),
    ("/analysis/report/monthly", "月度报告", "analysis"),
    ("/analysis/report/quarterly", "季度报告", "analysis"),
    ("/analysis/report/annual", "年度报告", "analysis"),
    ("/analysis/comparison/region", "区域对比", "analysis"),
    ("/analysis/comparison/industry", "行业对比", "analysis"),
    ("/analysis/comparison/period", "时期对比", "analysis"),
    ("/analysis/ent-report/summary", "企业汇总", "analysis"),
    ("/analysis/ent-report/detail", "企业详情报告", "analysis"),
    ("/analysis/ent-report/export", "报告导出", "analysis"),
]

ALL_ROUTES = MAP_ROUTES + ATLAS_ROUTES + ANALYSIS_ROUTES


def safe_filename(name):
    return name.replace("/", "_").replace(" ", "_")


def test_page(page, route, title, page_type):
    """Test a single page and return results dict."""
    result = {
        "route": route,
        "title": title,
        "type": page_type,
        "passed": [],
        "failed": [],
        "warnings": [],
    }
    
    try:
        # Ensure auth token persists between navigations
        page.evaluate('''
            if (!localStorage.getItem("zsyz_token")) {
                localStorage.setItem("zsyz_token", "mock-token-123456");
                localStorage.setItem("zsyz_user", JSON.stringify({username:"admin",role:"admin"}));
            }
        ''')
        page.goto(f"{BASE_URL}/#{route}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2500)
    except Exception as e:
        result["failed"].append(f"导航失败: {str(e)[:80]}")
        return result
    
    # Test 1: Page renders (not blank, not 404, not login redirect)
    url = page.url
    if "login" in url and "login" not in route:
        # Re-inject auth and retry
        page.evaluate('''
            localStorage.setItem("zsyz_token", "mock-token-123456");
            localStorage.setItem("zsyz_user", JSON.stringify({username:"admin",role:"admin"}));
        ''')
        page.goto(f"{BASE_URL}/#{route}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2500)
        url = page.url
        if "login" in url:
            result["failed"].append("页面被重定向到登录页(认证失败)")
            return result
    if "error/404" in url:
        result["failed"].append("页面显示404")
        return result
    
    body_text = page.locator("body").inner_text()
    if len(body_text.strip()) < 10:
        result["failed"].append("页面内容为空")
        return result
    result["passed"].append("页面正常渲染")
    
    # Test 2: Page title
    page_title = page.title()
    if title in page_title or "产业招商" in page_title:
        result["passed"].append(f"页面标题正确: {page_title}")
    else:
        result["warnings"].append(f"页面标题异常: {page_title}")
    
    # Test 3: PageHeader component exists (check h2 title as backup)
    header_count = page.locator(".page-header").count()
    h2_count = page.locator("h2").count()
    if header_count > 0 or h2_count > 0:
        result["passed"].append("PageHeader组件存在")
    else:
        result["failed"].append("缺少PageHeader组件")
    
    # Test 4: Console errors check
    console_errors = []
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text[:100])
    page.on("console", on_console)
    page.wait_for_timeout(500)
    page.remove_listener("console", on_console)
    
    # Filter out known harmless errors
    real_errors = [e for e in console_errors if "net::ERR" not in e and "favicon" not in e.lower()]
    if real_errors:
        result["warnings"].append(f"控制台错误({len(real_errors)}): {real_errors[0][:60]}")
    else:
        result["passed"].append("无控制台错误")
    
    # Test 5: Type-specific checks
    if page_type == "map":
        # Map pages should have maptalks-map
        map_count = page.locator(".maptalks-map").count()
        if map_count > 0:
            result["passed"].append("地图容器渲染成功")
        else:
            result["warnings"].append("地图容器未渲染(可能加载延迟)")
        
        # Map control panel
        control_count = page.locator(".map-control-panel").count()
        if control_count > 0:
            result["passed"].append("地图控制面板存在")
        else:
            result["warnings"].append("缺少地图控制面板")
    
    elif page_type == "atlas":
        # Atlas pages should have stat cards or force graph
        stat_count = page.locator(".stat-card").count()
        graph_container = page.locator(".graph-page__canvas").count() + page.locator("svg").count()
        
        if stat_count > 0:
            result["passed"].append(f"统计卡片: {stat_count}个")
        if graph_container > 0:
            result["passed"].append("力导向图渲染成功")
        if stat_count == 0 and graph_container == 0:
            result["warnings"].append("无统计卡片或图谱渲染")
    
    elif page_type == "analysis":
        # Analysis pages should have stat cards, charts, and possibly tables
        stat_count = page.locator(".stat-card").count()
        chart_count = page.locator(".base-chart").count() + page.locator(".chart-panel").count()
        canvas_count = page.locator("canvas").count()  # ECharts renders to canvas
        table_count = page.locator(".el-table").count()
        
        if stat_count > 0:
            result["passed"].append(f"统计卡片: {stat_count}个")
        else:
            result["warnings"].append("缺少统计卡片")
        
        if chart_count > 0 or canvas_count > 0:
            result["passed"].append(f"图表区域: {max(chart_count, canvas_count)}个")
        else:
            result["warnings"].append("缺少图表区域")
        
        if table_count > 0:
            result["passed"].append(f"数据表格: {table_count}个")
        
        # Check chart-grid or stat-cards layout
        chart_grid = page.locator(".chart-grid").count()
        stat_cards = page.locator(".stat-cards").count()
        if chart_grid > 0:
            result["passed"].append("图表网格布局正确")
        if stat_cards > 0:
            result["passed"].append("统计卡片行布局正确")
    
    # Take screenshot
    screenshot_name = safe_filename(f"{page_type}_{title}")
    try:
        page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"{screenshot_name}.png"))
    except Exception:
        pass
    
    return result


def main():
    print("=" * 70)
    print("  Phase 3 功能测试 - 产业招商平台")
    print("  测试范围: 产业地图(9) + 产业图谱(8) + 运行分析(25) = 42页")
    print("=" * 70)
    print()
    
    results = []
    start_time = time.time()
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1920, "height": 1080})
        
        # Setup authentication
        page.goto(BASE_URL)
        page.wait_for_load_state("networkidle")
        page.evaluate('''
            localStorage.setItem("zsyz_token", "mock-token-123456");
            localStorage.setItem("zsyz_user", JSON.stringify({username:"admin",role:"admin"}));
        ''')
        
        # Test all routes
        for i, (route, title, page_type) in enumerate(ALL_ROUTES):
            print(f"[{i+1:02d}/{len(ALL_ROUTES)}] 测试: {title} ({route})")
            result = test_page(page, route, title, page_type)
            results.append(result)
            
            # Print quick status
            if result["failed"]:
                print(f"  ❌ 失败: {', '.join(result['failed'][:2])}")
            elif result["warnings"]:
                print(f"  ⚠️  通过(有警告): {', '.join(result['warnings'][:2])}")
            else:
                print(f"  ✅ 通过 ({len(result['passed'])}项检查)")
        
        browser.close()
    
    elapsed = time.time() - start_time
    
    # === Summary Report ===
    print()
    print("=" * 70)
    print("  测试结果汇总")
    print("=" * 70)
    
    # By module
    for module_name, module_type in [("产业地图", "map"), ("产业图谱", "atlas"), ("运行分析", "analysis")]:
        module_results = [r for r in results if r["type"] == module_type]
        passed = sum(1 for r in module_results if not r["failed"])
        total = len(module_results)
        icon = "✅" if passed == total else "⚠️"
        print(f"\n{icon} {module_name}: {passed}/{total} 页面通过")
        
        for r in module_results:
            status = "✅" if not r["failed"] else "❌"
            line = f"  {status} {r['title']} ({r['route']})"
            if r["failed"]:
                line += f" - 失败: {'; '.join(r['failed'][:1])}"
            elif r["warnings"]:
                line += f" - 警告: {'; '.join(r['warnings'][:1])}"
            else:
                line += f" - {len(r['passed'])}项检查通过"
            print(line)
    
    # Overall stats
    total_pages = len(results)
    passed_pages = sum(1 for r in results if not r["failed"])
    failed_pages = total_pages - passed_pages
    total_checks = sum(len(r["passed"]) for r in results)
    total_warnings = sum(len(r["warnings"]) for r in results)
    total_failures = sum(len(r["failed"]) for r in results)
    
    print()
    print("-" * 70)
    print(f"  总页面: {total_pages} | 通过: {passed_pages} | 失败: {failed_pages}")
    print(f"  总检查项: {total_checks} | 警告: {total_warnings} | 失败项: {total_failures}")
    print(f"  通过率: {passed_pages/total_pages*100:.1f}%")
    print(f"  耗时: {elapsed:.1f}s")
    print("-" * 70)
    
    # Detailed failures
    if failed_pages > 0:
        print("\n❌ 失败详情:")
        for r in results:
            if r["failed"]:
                print(f"  {r['title']} ({r['route']}):")
                for f in r["failed"]:
                    print(f"    - {f}")
    
    # Detailed warnings
    if total_warnings > 0:
        print(f"\n⚠️  警告详情 ({total_warnings}条):")
        for r in results:
            if r["warnings"]:
                print(f"  {r['title']} ({r['route']}):")
                for w in r["warnings"]:
                    print(f"    - {w}")
    
    print(f"\n截图保存至: {SCREENSHOT_DIR}/")


if __name__ == "__main__":
    main()
