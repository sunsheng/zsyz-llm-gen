"""
Phase 4 功能测试 - 产业招商平台
测试模块: 产业动态(4) + 区域对标(8) + 风险预警(6) + 区域地图(3) + 精准招商(39) + 招商情报(9) + 企业监测(17) = 86页
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5173"
SCREENSHOT_DIR = "/tmp/phase4-test-screenshots"
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# === Test Routes ===
DYNAMICS_ROUTES = [
    ("/dynamics/news", "行业动态", "list"),
    ("/dynamics/policy", "政策速递", "list"),
    ("/dynamics/event", "产业事件", "list"),
    ("/dynamics/insight", "行业洞察", "list"),
]

BENCHMARKING_ROUTES = [
    ("/benchmarking/overview", "对标总览", "dashboard"),
    ("/benchmarking/economy", "经济对标", "dashboard"),
    ("/benchmarking/industry", "产业对标", "dashboard"),
    ("/benchmarking/innovation", "创新对标", "dashboard"),
    ("/benchmarking/investment", "招商对标", "dashboard"),
    ("/benchmarking/ranking", "区域排名", "list"),
    ("/benchmarking/swot", "SWOT分析", "dashboard"),
    ("/benchmarking/report", "对标报告", "dashboard"),
]

WARNING_ROUTES = [
    ("/warning/overview", "预警总览", "dashboard"),
    ("/warning/enterprise", "企业风险", "list"),
    ("/warning/industry", "产业风险", "dashboard"),
    ("/warning/policy", "政策风险", "dashboard"),
    ("/warning/supply", "供应链风险", "dashboard"),
    ("/warning/alert", "风险报警", "list"),
]

REGIONAL_MAP_ROUTES = [
    ("/regional-map/overview", "区域总览", "dashboard"),
    ("/regional-map/compare", "区域对比", "dashboard"),
    ("/regional-map/detail", "区域详情", "dashboard"),
]

INVEST_ROUTES = [
    ("/invest/chain/target", "目标筛选", "list"),
    ("/invest/chain/match", "链式匹配", "list"),
    ("/invest/chain/recommend", "智能推荐", "list"),
    ("/invest/chain/result", "推荐结果", "list"),
    ("/invest/map/target", "地图选商", "map"),
    ("/invest/map/nearby", "周边搜索", "map"),
    ("/invest/map/resource", "资源匹配", "map"),
    ("/invest/map/result", "招商结果", "list"),
    ("/invest/extension/analysis", "缺链分析", "dashboard"),
    ("/invest/extension/target", "补链目标", "list"),
    ("/invest/extension/result", "补链结果", "list"),
    ("/invest/relation/graph", "关系图谱", "graph"),
    ("/invest/relation/target", "关系目标", "list"),
    ("/invest/relation/result", "关系招商结果", "list"),
    ("/invest/merchant/anchor", "锚点企业", "list"),
    ("/invest/merchant/derive", "衍生搜索", "list"),
    ("/invest/merchant/result", "以商招商结果", "list"),
    ("/invest/listed/ranking", "榜单列表", "list"),
    ("/invest/listed/detail", "榜单详情", "list"),
    ("/invest/listed/target", "榜单目标", "list"),
    ("/invest/listed/result", "榜单招商结果", "list"),
    ("/invest/leading/overview", "龙头总览", "dashboard"),
    ("/invest/leading/detail", "龙头详情", "dashboard"),
    ("/invest/leading/target", "龙头目标", "list"),
    ("/invest/qualified/list", "资质列表", "list"),
    ("/invest/qualified/detail", "资质详情", "dashboard"),
    ("/invest/qualified/target", "资质企业目标", "list"),
    ("/invest/fund/overview", "基金总览", "dashboard"),
    ("/invest/fund/detail", "基金详情", "dashboard"),
    ("/invest/fund/target", "基金招商目标", "list"),
    ("/invest/research/overview", "机构总览", "dashboard"),
    ("/invest/research/detail", "机构详情", "dashboard"),
    ("/invest/research/target", "科研招商目标", "list"),
    ("/invest/owner/match", "链主匹配", "list"),
    ("/invest/owner/detail", "链主详情", "dashboard"),
    ("/invest/owner/result", "链主适配结果", "list"),
    ("/invest/park/overview", "园区总览", "dashboard"),
    ("/invest/park/detail", "园区详情", "dashboard"),
    ("/invest/park/target", "园区招商目标", "list"),
]

INTELLIGENCE_ROUTES = [
    ("/intelligence/news", "招商资讯", "list"),
    ("/intelligence/project", "项目信息", "list"),
    ("/intelligence/technology", "技术转移", "list"),
    ("/intelligence/qualification", "资质变更", "list"),
    ("/intelligence/capital", "资本动态", "list"),
    ("/intelligence/talent", "人才流动", "list"),
    ("/intelligence/event", "招商活动", "list"),
    ("/intelligence/track", "情报追踪", "list"),
    ("/intelligence/report", "情报报告", "dashboard"),
]

MONITOR_ROUTES = [
    ("/monitor/overview/summary", "监测总览", "dashboard"),
    ("/monitor/overview/dashboard", "监测仪表盘", "dashboard"),
    ("/monitor/overview/map", "监测地图", "map"),
    ("/monitor/health/overview", "健康度总览", "dashboard"),
    ("/monitor/health/detail", "健康度详情", "dashboard"),
    ("/monitor/health/trend", "健康度趋势", "dashboard"),
    ("/monitor/rankings/revenue", "营收榜单", "list"),
    ("/monitor/rankings/growth", "成长榜单", "list"),
    ("/monitor/filter/enterprise", "企业筛选", "list"),
    ("/monitor/filter/industry", "行业筛选", "list"),
    ("/monitor/filter/region", "区域筛选", "list"),
    ("/monitor/filter/custom", "自定义筛选", "list"),
    ("/monitor/portrait/overview", "画像总览", "dashboard"),
    ("/monitor/portrait/detail", "画像详情", "dashboard"),
    ("/monitor/portrait/compare", "画像对比", "dashboard"),
    ("/monitor/evaluation/index", "评价指数", "dashboard"),
]

ALL_ROUTES = (DYNAMICS_ROUTES + BENCHMARKING_ROUTES + WARNING_ROUTES + 
              REGIONAL_MAP_ROUTES + INVEST_ROUTES + INTELLIGENCE_ROUTES + MONITOR_ROUTES)

MODULE_NAMES = {
    "dynamics": "产业动态", "benchmarking": "区域对标", "warning": "风险预警",
    "regional-map": "区域地图", "invest": "精准招商", "intelligence": "招商情报", "monitor": "企业监测"
}

def get_module(route):
    parts = route.strip("/").split("/")
    return parts[0] if parts else "unknown"


def safe_filename(name):
    return name.replace("/", "_").replace(" ", "_")


def test_page(page, route, title, page_type):
    """Test a single page and return results dict."""
    result = {
        "route": route,
        "title": title,
        "type": page_type,
        "module": get_module(route),
        "passed": [],
        "failed": [],
        "warnings": [],
    }
    
    try:
        # Ensure auth token persists
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
    
    # Test 1: Not redirected to login or 404
    url = page.url
    if "login" in url and "login" not in route:
        page.evaluate('''
            localStorage.setItem("zsyz_token", "mock-token-123456");
            localStorage.setItem("zsyz_user", JSON.stringify({username:"admin",role:"admin"}));
        ''')
        page.goto(f"{BASE_URL}/#{route}")
        page.wait_for_load_state("networkidle")
        page.wait_for_timeout(2500)
        url = page.url
        if "login" in url:
            result["failed"].append("认证失败(重定向登录页)")
            return result
    
    if "error/404" in url:
        result["failed"].append("页面404")
        return result
    
    # Test 2: Page has content
    body_text = page.locator("body").inner_text()
    if len(body_text.strip()) < 5:
        result["failed"].append("页面内容为空(白屏)")
        return result
    result["passed"].append("页面正常渲染")
    
    # Test 3: Page title correct
    page_title = page.title()
    if title in page_title or "产业招商" in page_title:
        result["passed"].append(f"页面标题正确")
    else:
        result["warnings"].append(f"标题异常: {page_title[:30]}")
    
    # Test 4: PageHeader or h2 exists
    header_count = page.locator(".page-header").count()
    h2_count = page.locator("h2").count()
    if header_count > 0 or h2_count > 0:
        result["passed"].append("页头组件存在")
    else:
        result["failed"].append("缺少页头组件(PageHeader+h2)")
    
    # Test 5: No critical console errors
    console_errors = []
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text[:100])
    page.on("console", on_console)
    page.wait_for_timeout(500)
    page.remove_listener("console", on_console)
    real_errors = [e for e in console_errors if "net::ERR" not in e and "favicon" not in e.lower() and "parentNode" not in e]
    if real_errors:
        result["warnings"].append(f"控制台错误({len(real_errors)}): {real_errors[0][:50]}")
    else:
        result["passed"].append("无控制台错误")
    
    # Test 6: Type-specific checks
    if page_type == "dashboard":
        stat_count = page.locator(".stat-card").count()
        chart_count = page.locator(".base-chart").count() + page.locator(".chart-panel").count()
        canvas_count = page.locator("canvas").count()
        table_count = page.locator(".el-table").count()
        
        if stat_count > 0:
            result["passed"].append(f"统计卡片: {stat_count}个")
        if chart_count > 0 or canvas_count > 0:
            result["passed"].append(f"图表: {max(chart_count, canvas_count)}个")
        else:
            result["warnings"].append("未检测到图表")
        if table_count > 0:
            result["passed"].append(f"表格: {table_count}个")
    
    elif page_type == "list":
        table_count = page.locator(".el-table").count()
        card_count = page.locator(".el-card").count()
        list_items = page.locator(".list-item, .news-item, .project-card, .enterprise-card").count()
        
        if table_count > 0:
            result["passed"].append(f"数据表格: {table_count}个")
        elif card_count > 0 or list_items > 0:
            result["passed"].append(f"列表卡片: {card_count + list_items}个")
        else:
            # Check for any content with search/filter
            search_count = page.locator("input[type='text'], .el-input").count()
            if search_count > 0:
                result["passed"].append("搜索筛选存在")
            else:
                result["warnings"].append("未检测到列表/表格内容")
        
        # Check for filter/search capability
        filter_count = page.locator(".el-select, .el-input, .search-filter-bar").count()
        if filter_count > 0:
            result["passed"].append("筛选/搜索功能存在")
    
    elif page_type == "map":
        map_count = page.locator(".maptalks-map").count()
        if map_count > 0:
            result["passed"].append("地图容器渲染成功")
        else:
            result["warnings"].append("地图容器未渲染")
        
        control_count = page.locator(".map-control-panel").count()
        if control_count > 0:
            result["passed"].append("地图控制面板存在")
    
    elif page_type == "graph":
        svg_count = page.locator("svg").count()
        graph_canvas = page.locator(".graph-page__canvas").count()
        if svg_count > 0 or graph_canvas > 0:
            result["passed"].append("关系图渲染成功")
        else:
            result["warnings"].append("关系图未渲染")
    
    # Screenshot (only for failures/warnings to save disk space)
    if result["failed"] or result["warnings"]:
        screenshot_name = safe_filename(f"{get_module(route)}_{title}")
        try:
            page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"{screenshot_name}.png"))
        except Exception:
            pass
    
    return result


def main():
    print("=" * 70)
    print("  Phase 4 功能测试 - 产业招商平台")
    print("  测试范围: 7个业务模块, 86页")
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
            module_name = MODULE_NAMES.get(get_module(route), get_module(route))
            print(f"[{i+1:02d}/{len(ALL_ROUTES)}] {module_name} > {title} ({route})")
            result = test_page(page, route, title, page_type)
            results.append(result)
            
            if result["failed"]:
                print(f"  ❌ 失败: {'; '.join(result['failed'][:2])}")
            elif result["warnings"]:
                print(f"  ⚠️  通过(警告): {'; '.join(result['warnings'][:2])}")
            else:
                print(f"  ✅ 通过 ({len(result['passed'])}项)")
        
        browser.close()
    
    elapsed = time.time() - start_time
    
    # === Summary Report ===
    print()
    print("=" * 70)
    print("  Phase 4 测试结果汇总")
    print("=" * 70)
    
    # By module
    for module_key, module_name in MODULE_NAMES.items():
        module_results = [r for r in results if r["module"] == module_key]
        if not module_results:
            continue
        passed = sum(1 for r in module_results if not r["failed"])
        total = len(module_results)
        icon = "✅" if passed == total else "⚠️" if passed > total // 2 else "❌"
        print(f"\n{icon} {module_name}: {passed}/{total} 页面通过")
        
        for r in module_results:
            status = "✅" if not r["failed"] else "❌"
            line = f"  {status} {r['title']} ({r['route']})"
            if r["failed"]:
                line += f" - {'; '.join(r['failed'][:1])}"
            elif r["warnings"]:
                line += f" - ⚠ {'; '.join(r['warnings'][:1])}"
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
    
    print(f"\n截图保存至: {SCREENSHOT_DIR}/")


if __name__ == "__main__":
    main()
