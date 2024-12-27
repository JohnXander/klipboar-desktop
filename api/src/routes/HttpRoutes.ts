import { Router } from "express";
import * as routes from "../lib/constants/routes";
import { createUser } from "../controllers/user/createUser";
import { createAssignment } from "../controllers/assignment/createAssignment";
import { createSite } from "../controllers/site/createSite";
import { getAllAssignments } from "../controllers/assignment/getAssignments";
import { getAllSites } from "../controllers/site/getSites";
import { updateSite } from "../controllers/site/updateSite";
import { loginUser } from "../controllers/user/loginUser";
import passport from 'passport';
import { AuthStrategy } from "../lib/enums/authStrategy.enum";
import { DEFAULT_PASSPORT_OPTIONS } from "../lib/constants/auth";
import { createOrganisation } from "../controllers/organisation/createOrganisation";
import { getAllOrganisations } from "../controllers/organisation/getOrganisations";
import { modifyUserInOrganisation } from "../controllers/organisation/updateOrganisation";
import { createGuideline } from "../controllers/guideline/createGuideline";
import { updateAssignment } from "../controllers/assignment/updateAssignment";
import { getAllGuidelines } from "../controllers/guideline/getGuidelines";
import { updateGuideline } from "../controllers/guideline/updateGuideline";
import { getAllUsers } from "../controllers/user/getUsers";

const router = Router();

/**
 * Organisations
 */
router.get(
  routes.ORGANISATIONS, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  getAllOrganisations
);

router.post(
  routes.ORGANISATIONS, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  createOrganisation
);

router.patch(
  routes.ORGANISATION_BY_ID, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  modifyUserInOrganisation
);

/**
 * Assignments
 */
router.get(
  routes.ASSIGNMENTS, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  getAllAssignments
);

router.post(
  routes.ASSIGNMENTS, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  createAssignment
);

router.patch(
  routes.ASSIGNMENT_BY_ID, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  updateAssignment
);

/**
 * Guidelines
 */
router.get(
  routes.GUIDELINES, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  getAllGuidelines
);

router.post(
  routes.GUIDELINES, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  createGuideline
);

router.patch(
  routes.GUIDELINE_BY_ID, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  updateGuideline
);

/**
 * Sites
 */
router.get(
  routes.SITES,
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  getAllSites
);

router.post(
  routes.SITES, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  createSite
);

router.patch(
  routes.SITE_BY_ID, 
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  updateSite
);

/**
 * Users
 */
router.get(
  routes.USERS,
  passport.authenticate(AuthStrategy.JWT, DEFAULT_PASSPORT_OPTIONS),
  getAllUsers
);

router.post(routes.REGISTER, createUser);
router.post(routes.LOGIN, loginUser);

export default router;
