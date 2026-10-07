export type PermissionChecker = {
  can(subject: string, action: string, resource?: string): Promise<boolean>;
};

export const allowAllPermissionChecker: PermissionChecker = {
  async can() {
    return true;
  },
};

export const denyAllPermissionChecker: PermissionChecker = {
  async can() {
    return false;
  },
};
