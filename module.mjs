// @ts-check
import { module } from "@prisma/composer";
import automspPortalService from "./service.mjs";

export default module("automsp-bos", ({ provision }) => {
  provision(automspPortalService, { id: "automspportal" });
});
