export const aboutController = {
  index: {
    handler: async function (request, h) {
      const viewData = {
        title: "About Playtime",
      };
      return h.view("about-view", viewData);
    },
  },
};