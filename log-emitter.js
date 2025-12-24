// Log emitter script - generates requests to create server logs for testing
// This helps test log aggregation in deployment servers

(function() {
    'use strict';
    
    let requestCounter = 0;
    const logInterval = 5000; // 5 seconds
    
    // Function to make a request that will be logged by nginx
    function emitLogRequest() {
        requestCounter++;
        const timestamp = new Date().toISOString();
        
        // Make a request to a non-existent endpoint or the same page
        // This will generate logs in nginx access logs
        fetch('?log-request=' + requestCounter + '&t=' + Date.now(), {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'X-Log-Emitter': 'true',
                'X-Request-Number': requestCounter.toString()
            }
        }).catch(function(err) {
            // Silently handle errors - we just want to generate logs
            console.log('[Log Emitter] Request #' + requestCounter + ' logged at ' + timestamp);
        });
        
        // Also log to console for client-side testing
        console.log('[Log Emitter] Generated log request #' + requestCounter + ' at ' + timestamp);
    }
    
    // Start emitting logs when page loads
    console.log('[Log Emitter] Started - will emit log requests every ' + (logInterval/1000) + ' seconds');
    
    // Emit initial log
    emitLogRequest();
    
    // Set up interval to emit logs periodically
    setInterval(emitLogRequest, logInterval);
    
})();

