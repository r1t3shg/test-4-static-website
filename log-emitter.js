// Log emitter script - generates requests to create server logs for testing
// This helps test log aggregation in deployment servers

(function() {
    'use strict';
    
    let requestCounter = 0;
    const logInterval = 5000; // 5 seconds
    const maxLogsDisplay = 50; // Maximum number of logs to display
    const logContainer = document.getElementById('log-container');
    
    // Function to add log entry to UI
    function addLogToUI(level, message, timestamp) {
        if (!logContainer) return;
        
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry log-' + level;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'log-time';
        timeSpan.textContent = new Date(timestamp).toLocaleTimeString();
        
        const messageSpan = document.createElement('span');
        messageSpan.className = 'log-message';
        messageSpan.textContent = message;
        
        logEntry.appendChild(timeSpan);
        logEntry.appendChild(messageSpan);
        
        // Add to top of container
        logContainer.insertBefore(logEntry, logContainer.firstChild);
        
        // Limit number of displayed logs
        while (logContainer.children.length > maxLogsDisplay) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
    
    // Function to make a request that will be logged by nginx
    function emitLogRequest() {
        requestCounter++;
        const timestamp = new Date().toISOString();
        const logMessage = 'Generated log request #' + requestCounter;
        
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
        
        // Add log to UI
        addLogToUI('info', logMessage, timestamp);
        
        // Also log to console for client-side testing
        console.log('[Log Emitter] ' + logMessage + ' at ' + timestamp);
    }
    
    // Start emitting logs when page loads
    const startMessage = 'Started - will emit log requests every ' + (logInterval/1000) + ' seconds';
    console.log('[Log Emitter] ' + startMessage);
    addLogToUI('info', startMessage, new Date().toISOString());
    
    // Emit initial log
    emitLogRequest();
    
    // Set up interval to emit logs periodically
    setInterval(emitLogRequest, logInterval);
    
})();

