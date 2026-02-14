import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface Project {
    id: string;
    projectName: string;
    ownerId: Principal;
    baseColor: string;
    garmentType: string;
    lastModified: Time;
    elements: Array<DesignElement>;
}
export interface DesignElement {
    content: string;
    color: string;
    posX: bigint;
    posY: bigint;
    size: bigint;
    type: string;
}
export interface UserProfile {
    name: string;
}
export interface ProjectSummary {
    id: string;
    projectName: string;
    lastModified: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(projectName: string, garmentType: string, baseColor: string): Promise<string>;
    deleteProject(projectId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(projectId: string): Promise<Project | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(user: Principal): Promise<Array<ProjectSummary>>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProject(projectId: string, updatedProject: Project): Promise<void>;
}
