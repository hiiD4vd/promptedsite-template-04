import urllib.request
urls = [
    '/js/jquery-3.5.1.min.dc5e7f18c8.js',
    '/69fb53371d5b8e9c3f4e4c69/js/webflow.9a82b613.29781a31e070a6c4.js',
    '/gsap/3.15.0/gsap.min.js',
    '/gsap/3.15.0/ScrollTrigger.min.js',
    '/gsap/3.15.0/SplitText.min.js',
    '/app-init.js',
    '/app-module.js'
]
print("Fetching from localhost:3001")
for u in urls:
    try:
        req = urllib.request.urlopen('http://localhost:3001' + u)
        print(f"OK: {u}")
    except Exception as e:
        print(f"ERR: {u} - {e}")
