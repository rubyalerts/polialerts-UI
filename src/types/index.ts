// why this file is called index.ts?
// Channel Interface
export interface Channel {
    id: string;
    main_category: string;
    sub_category: string;
    real_time_alert_keywords: string[];
    report_alert_keywords: string[];
    recipients: string[];
    quote_context: number;
    tags: string[];
}

// User Interface
export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNo?: string;
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    subscription_type: string;
    subscriptionDetails: SubscriptionDetails;
    channels: Channel[];
}

// Keyword Interface
export interface Keyword {
    user_ids: string[];
    tags: string[];
}

// Category Interface
export interface Category {
    id: string;
    name: string;
    parent: string;
    streaming_source: string;
    tags: string[];
}

// Subscription Details Interface
export interface SubscriptionDetails {
    name: string;
    channels_limit: number;
    report_alert_keywords_limit: number;
    recipients_limit: number;
}


// --------------------- Repositories ----------------------
export interface IUserRepository {
    createUser(userData: ICreateUserRequestData): Promise<boolean>;
    getUsers(): Promise<User[]>;
    getUserById(userId: string): Promise<User | undefined>;
    addChannel(userId: string, channelId: string, channel: IAddChannelRequestData): Promise<boolean>;
    getChannel(userId: string, channelId: string): Promise<Channel>;
    getChannels(userId: string): Promise<Channel[]>;
    updateChannel(userId: string, channelId: string, updatedChannel: IAddChannelRequestData): Promise<boolean>;
    deleteChannel(userId: string, channelId: string): Promise<boolean>;
    updateProfile(updatedData: Partial<User>, userId: string): Promise<boolean>;
    // addRealTimeAlertKeyword(userId: string, channelId: string, keyword: string): void;
    // addReportAlertKeyword(userId: string, channelId: string, keyword: string): void
}

export interface ICategoryRepository {
    getCategories(parent: string): Promise<Category[]>;
}

export interface IKeywordRepository {
    addKeyword(userId: string, channelId: string, keyword: string): Promise<boolean>;
    deleteKeyword(userId: string, channelId: string, keyword: string): Promise<boolean>;
}

// Request Data
export interface ICreateUserRequestData {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
}

export interface IAddChannelRequestData {
    main_category: string;
    sub_category: string;
    real_time_alert_keywords: string[],
    report_alert_keywords: string[],
    recipients: string[],
    quote_context: number,
    tags: string[]
}