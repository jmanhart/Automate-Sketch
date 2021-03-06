module.exports = function(context, eventCategory) {

    var identifier = context.plugin.identifier();
    var userDefaults = NSUserDefaults.standardUserDefaults();
    var useGoogleAnalytics = userDefaults.objectForKey(identifier + ".useGoogleAnalytics");

    if (useGoogleAnalytics == null) {
        var dialog = NSAlert.alloc().init();
        var icon = NSImage.alloc().initWithContentsOfURL(context.plugin.urlForResourceNamed("icon.png"));
        dialog.setIcon(icon);
        dialog.setMessageText("Warning");
        dialog.setInformativeText("Automate Sketch use Google Analytics for tacking data. You can press \"Disagree\" to disable tacking.");
        dialog.addButtonWithTitle("Agree");
        dialog.addButtonWithTitle("Disagree");
        var responseCode = dialog.runModal();
        // Agree
        if (responseCode == 1000) {
            userDefaults.setObject_forKey(true, identifier + ".useGoogleAnalytics");
        }
        // Disagree
        if (responseCode == 1001) {
            userDefaults.setObject_forKey(false, identifier + ".useGoogleAnalytics");
        }
        userDefaults.synchronize();
    }

    useGoogleAnalytics = userDefaults.objectForKey(identifier + ".useGoogleAnalytics");
    if (useGoogleAnalytics == true) {

        var trackingID = "UA-99098773-3";

        var uuidKey = "google.analytics.uuid";
        var uuid = userDefaults.objectForKey(uuidKey);
        if (!uuid) {
            uuid = NSUUID.UUID().UUIDString();
            userDefaults.setObject_forKey(uuid, uuidKey);
            userDefaults.synchronize();
        }

        var appName = encodeURI(context.plugin.name()),
            appId = context.plugin.identifier(),
            appVersion = context.plugin.version();

        var url = "https://www.google-analytics.com/collect?v=1";
        // Tracking ID
        url += "&tid=" + trackingID;
        // Source
        url += "&ds=sketch" + MSApplicationMetadata.metadata().appVersion;
        // Client ID
        url += "&cid=" + uuid;
        // User GEO location
        url += "&geoid=" + NSLocale.currentLocale().countryCode();
        // User language
        url += "&ul=" + NSLocale.currentLocale().localeIdentifier().toLowerCase();
        // pageview, screenview, event, transaction, item, social, exception, timing
        url += "&t=event";
        // App Name
        url += "&an=" + appName;
        // App ID
        url += "&aid=" + appId;
        // App Version
        url += "&av=" + appVersion;
        // Event category
        url += "&ec=" + encodeURI(eventCategory);
        // Event action
        // url += "&ea=" + encodeURI(eventAction);
        url += "&ea=" + encodeURI(context.command.identifier());
        // Event label
        // if (eventLabel) {
        //     url += "&el=" + encodeURI(eventLabel);
        // }
        // Event value
        // if (eventValue) {
        //     url += "&ev=" + encodeURI(eventValue);
        // }

        var session = NSURLSession.sharedSession();
        var task = session.dataTaskWithURL(NSURL.URLWithString(NSString.stringWithString(url)));
        task.resume();

    } else {
        return;
    }

}
