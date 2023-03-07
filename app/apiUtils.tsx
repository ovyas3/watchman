




export async function post(url: any, payload: any) {
    
    const response = await fetch('https://dev-api.instavans.com/api/thor/' + url, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return await response.json();
  }