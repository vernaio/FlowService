$.get('/controller/spo-settings')
.done(function(data){
    $('#spo-settings-url').html(data.url);
    $('#spo-settings-tenant').html(data.tenant);
    $('#spo-settings-workspace').html(data.workspaceId);
    $('#spo-settings-user').html(data.user);
});

$.get('/version')
.done(function(data){
    $('#integration-name').html(data.integration.name);
    $('#integration-version').html(data.integration.versionNumber);
});