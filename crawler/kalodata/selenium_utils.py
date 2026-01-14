import json
from selenium.webdriver.remote.webdriver import WebDriver

def selenium_fetch(driver: WebDriver, url: str, method: str = 'GET', headers: dict = None, json_data: dict = None, timeout: int = 30):
    """
    Performs a fetch request inside the browser using the Selenium driver.
    Mimics the requests.request API.
    
    :param driver: The Selenium WebDriver instance.
    :param url: The URL to request.
    :param method: "GET", "POST", etc.
    :param headers: Dictionary of headers to send.
    :param json_data: Dictionary representing the JSON body (for POST/PUT).
    :param timeout: Script execution timeout in seconds.
    :return: Dictionary containing the JSON response.
    :raises: Exception if the request fails or returns an error.
    """
    if headers is None:
        headers = {}
    
    # Prepare the body
    body_str = "null"
    if json_data is not None:
        body_str = json.dumps(json_data)
    
    # JavaScript code to execute fetch
    # We use execute_async_script to handle the promise
    script = f"""
    var done = arguments[arguments.length - 1];
    var url = arguments[0];
    var method = arguments[1];
    var headers = arguments[2];
    var body = {body_str};

    var options = {{
        method: method,
        headers: headers
    }};

    if (body !== null) {{
        options.body = JSON.stringify(body);
    }}

    fetch(url, options)
    .then(response => {{
        if (!response.ok) {{
            return response.text().then(text => ({{status: response.status, error: text}}));
        }}
        return response.json();
    }})
    .then(data => done(data))
    .catch(err => done({{error: err.toString()}}));
    """
    
    # Set timeout for the script
    driver.set_script_timeout(timeout)
    
    # Execute the script
    # Note: We pass url, method, headers as arguments[0], [1], [2]
    # body is injected directly into the script string for simplicity (JSON.dumps handles quoting),
    # but strictly passing it as an argument is also fine. 
    # Let's pass it as an argument to be safer with serialization, actually.
    
    # REVISED SCRIPT to receive body as argument[3]
    script = """
    var done = arguments[arguments.length - 1];
    var url = arguments[0];
    var method = arguments[1];
    var headers = arguments[2];
    var body = arguments[3];

    var options = {
        method: method,
        headers: headers
    };

    if (body !== null) {
        options.body = JSON.stringify(body);
    }

    fetch(url, options)
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => ({status: response.status, error: text}));
        }
        return response.json();
    })
    .then(data => done(data))
    .catch(err => done({error: err.toString()}));
    """

    result = driver.execute_async_script(script, url, method, headers, json_data)
    
    if isinstance(result, dict) and 'error' in result:
        # Check if it looks like a fetch error or status error
        if 'status' in result:
             raise Exception(f"Request failed with status {result['status']}: {result['error']}")
        else:
             raise Exception(f"Fetch error: {result['error']}")
             
    return result
