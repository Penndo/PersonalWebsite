from playwright.sync_api import sync_playwright
import sys

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    console_messages = []
    errors = []
    
    page.on('console', lambda msg: console_messages.append(f'[{msg.type}] {msg.text}'))
    page.on('pageerror', lambda err: errors.append(str(err)))
    
    try:
        page.goto('http://localhost:5173/', timeout=10000)
        page.wait_for_load_state('networkidle', timeout=10000)
        
        page.screenshot(path='d:/俞朋/code/personal-website/screenshot.png', full_page=True)
        
        print("=== Console Messages ===")
        for msg in console_messages:
            print(msg)
        
        print("\n=== Errors ===")
        for err in errors:
            print(err)
        
        print("\n=== Page Title ===")
        print(page.title())
        
        print("\n=== Body HTML (first 2000 chars) ===")
        body_html = page.locator('body').inner_html()
        print(body_html[:2000] if body_html else 'EMPTY')
        
        print("\n=== Body Text (first 500 chars) ===")
        body_text = page.locator('body').inner_text()
        print(body_text[:500] if body_text else 'EMPTY')
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()
