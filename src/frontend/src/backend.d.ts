import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface NewsArticle {
    id: ArticleId;
    title: string;
    creator: Principal;
    source: string;
    summary: string;
    shareCount: bigint;
    timestamp: bigint;
    category: Category;
}
export type ArticleId = bigint;
export interface UserProfile {
    name: string;
}
export enum Category {
    social = "social",
    viral = "viral",
    trending = "trending",
    politics = "politics"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createNewsArticle(title: string, summary: string, category: Category, source: string): Promise<ArticleId>;
    deleteNewsArticle(id: ArticleId): Promise<void>;
    getArticlesByCategory(category: Category): Promise<Array<NewsArticle>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNewsArticle(id: ArticleId): Promise<NewsArticle>;
    getPaginatedArticles(page: bigint): Promise<Array<NewsArticle>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    shareNewsArticle(id: ArticleId): Promise<void>;
    updateNewsArticle(id: ArticleId, title: string, summary: string, category: Category, source: string): Promise<NewsArticle>;
}
