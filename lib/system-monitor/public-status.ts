import { SystemStatus } from "./status-utils";

export function getPublicOverallStatus(notionStatus: SystemStatus, supabaseStatus: SystemStatus) {
    if (notionStatus === 'error' || supabaseStatus === 'error') {
        return 'major_outage';
    }
    if (notionStatus === 'degraded' || supabaseStatus === 'degraded') {
        return 'partial_outage';
    }
    return 'operational';
}

export function getPublicServices(notionStatus: SystemStatus, supabaseStatus: SystemStatus) {
    return [
        {
            name: 'Website',
            status: 'operational', // If this code is running, the website is up
            description: 'Main application and user interface'
        },
        {
            name: 'Content',
            status: notionStatus,
            description: 'Articles, Blog, Wiki, and Projects'
        },
        {
            name: 'Authentication',
            status: supabaseStatus,
            description: 'User login and account management'
        },
        {
            name: 'Comments',
            status: (notionStatus === 'operational' && supabaseStatus === 'operational')
                ? 'operational'
                : (notionStatus === 'error' || supabaseStatus === 'error') ? 'error' : 'degraded',
            description: 'Native commenting system'
        }
    ];
}
