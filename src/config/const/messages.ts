export const Messages = {
  success: {
    create: (resource: string) => `${resource} signup successfully.`,
    login: (resource: string) => `${resource} login successfully.`,
    get: (resource: string) => `${resource} retrieved successfully.`,
    list: (resource: string) => `List of ${resource} retrieved successfully.`,
    patch: (resource: string) => `${resource} partially updated successfully.`,
    delete: (resource: string) => `${resource} deleted successfully.`,
    health: "Service is healthy.",
  },
};
