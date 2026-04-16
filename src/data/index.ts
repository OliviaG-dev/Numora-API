/**
 * @fileoverview Export centralisé des données numérologiques
 * Ce fichier centralise tous les exports de données numérologiques et leurs types TypeScript
 */

// ===== IMPORTS =====
import lifePathData from "./numerology/Basique/LifePathData.json";
import expressionData from "./numerology/Basique/ExpressionNumberData.json";
import challengeData from "./numerology/Basique/ChallengeData.json";
import soulUrgeData from "./numerology/Basique/SoulUrgeData.json";
import personalityData from "./numerology/Basique/PersonalityData.json";
import birthdayData from "./numerology/Basique/BirthdayData.json";
import heartNumberPersonalData from "./numerology/Basique/HeartNumberPersonalData.json";
import realisationNumberData from "./numerology/Basique/RealisationNumber.json";
import lifeCycleData from "./numerology/Dates/LifeCycleData.json";
import realizationPeriodData from "./numerology/Dates/RealizationPeriodData.json";
import personelCycleData from "./numerology/Dates/PersonelCycleData.json";
import karmicNumberData from "./numerology/Karmique/KarmicNumberData.json";
import cycleKarmicData from "./numerology/Karmique/CycleKarmicData.json";
import karmicDebtsData from "./numerology/Karmique/KarmicDebtsData.json";
import businessNameData from "./numerology/NaneBusiness/BusinessNameData.json";
import dateVibeData from "./numerology/Dates/DateVibeData.json";
import actifBusinessData from "./numerology/NaneBusiness/ActifBusinessData.json";
import expressionBusinessData from "./numerology/DateBusiness/ExpressionBusinessData.json";
import hereditaryBusinessData from "./numerology/NaneBusiness/HereditaryBusinessData.json";
import comptaBusnessData from "./numerology/NaneBusiness/ComptaBusnessData.json";
import matrixRelationsHeartData from "./matrixDestiny/matrixRelationsHeart.json";
import matrixMoneyLoveData from "./matrixDestiny/matrixMoneyLove.json";
import externalRelationsData from "./matrixDestiny/externalRelations.json";
import baseNumberData from "./matrixDestiny/baseNumber.json";
import centralMissionData from "./matrixDestiny/centralMission.json";
import feminineLineData from "./matrixDestiny/feminineLine.json";
import masculineLineData from "./matrixDestiny/masculineLine.json";
import sephirothData from "./arbreDeVie/sephirothData.json";
import sephirothNumberData from "./arbreDeVie/sephirothNumberData.json";
import pathsData from "./arbreDeVie/pathsData.json";
import pathsNumberData from "./arbreDeVie/pathsNumberData.json";
import lifePathLoveData from "./numerology/Compatibility/Love/LifePathLoveData.json";
import unionNumberData from "./numerology/Compatibility/Love/UnionNumberData.json";
import expressionNumberLoveData from "./numerology/Compatibility/Love/ExpressionNumberLoveData.json";
import numberHeartData from "./numerology/Compatibility/Love/NumberHeartData.json";
import lifePathFriendsData from "./numerology/Compatibility/Friends/LifePathFriendsData.json";
import expressionNumberFriendsData from "./numerology/Compatibility/Friends/ExpressionNumberFriendsData.json";
import personalityNumberFriendsData from "./numerology/Compatibility/Friends/PersonnalityNumberFriendsData.json";
import lifePathWorkData from "./numerology/Compatibility/Work/LifePathWorkData.json";
import expressionNumberWorkData from "./numerology/Compatibility/Work/ExpressionNumberWorkData.json";
import expressionWorkData from "./numerology/Work/ExpressionNumberWorkData.json";
import heartNumberWorkData from "./numerology/Work/HeartNumberWorkData.json";
import pathLifeWorkData from "./numerology/Work/PathLifeWorkDate.json";
import yearFusionData from "./numerology/Dates/YearFusionData.json";
import crystalPathData from "./numerology/crystal/crystalPathData.json";
import crystalExpressionData from "./numerology/crystal/crystalExpressionData.json";
import crystalSyntheseData from "./numerology/crystal/crystalSyntheseData.json";
import rawVibrationAdresseData from "./placevibration/vibrationAdresse.json";
import rawVibrationLocaliteData from "./placevibration/vibrationLocalite.json";
import rawLifePathAddressVibrationCompatData from "./placevibration/vibationPathAdress.json";

// Import des fonctions utilitaires pour les calculs
import { reduceToSingleDigit } from "../modules/numerology/utils";

// ===== EXPORTS PRINCIPAUX =====
export {
  lifePathData,
  expressionData,
  challengeData,
  soulUrgeData,
  personalityData,
  birthdayData,
  heartNumberPersonalData,
  realisationNumberData,
  lifeCycleData,
  realizationPeriodData,
  personelCycleData,
  karmicNumberData,
  cycleKarmicData,
  karmicDebtsData,
  businessNameData,
  dateVibeData,
  actifBusinessData,
  expressionBusinessData,
  hereditaryBusinessData,
  comptaBusnessData,
  matrixRelationsHeartData,
  matrixMoneyLoveData,
  externalRelationsData,
  baseNumberData,
  centralMissionData,
  feminineLineData,
  masculineLineData,
  sephirothData,
  sephirothNumberData,
  pathsData,
  pathsNumberData,
  lifePathLoveData,
  unionNumberData,
  expressionNumberLoveData,
  numberHeartData,
  lifePathFriendsData,
  expressionNumberFriendsData,
  personalityNumberFriendsData,
  lifePathWorkData,
  expressionNumberWorkData,
  expressionWorkData,
  heartNumberWorkData,
  pathLifeWorkData,
  yearFusionData,
  crystalPathData,
  crystalExpressionData,
  crystalSyntheseData,
};

// ===== ALIAS POUR COMPATIBILITÉ =====
export { lifePathData as numbersData };
export { expressionData as expressionNumberData };
export { soulUrgeData as soulUrgeNumberData };
export { personalityData as personalityNumberData };
export { birthdayData as birthdayNumberData };
export { realisationNumberData as realisationNumberDetail };

// ===== TYPES TYPESCRIPT =====

/**
 * Types de base pour les données numérologiques
 */
export type NumerologyNumber = string; // "1" à "9", "11", "22", "33"
export type NumerologyKey =
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "11"
  | "22"
  | "33";

/**
 * Interface de base pour les détails numérologiques avec description complète
 */
export interface BaseNumerologyDetail {
  title: string;
  keywords: string[];
  description: string;
  strengths: string;
  challenges: string;
  mission: string;
  [key: string]: unknown;
}

/**
 * Interface de base pour les détails numérologiques avec résumé
 */
export interface BaseSummaryDetail {
  summary: string;
  details: string;
  [key: string]: unknown;
}

/**
 * Interface de base pour les détails numérologiques avec description et défi
 */
export interface BaseCycleDetail {
  summary: string;
  description: string;
  challenge: string;
  [key: string]: unknown;
}

/**
 * Types spécifiques pour chaque catégorie numérologique
 */
export interface LifePathData {
  [key: string]: LifePathDetail;
}

export type LifePathDetail = BaseNumerologyDetail;

export interface ExpressionData {
  [key: string]: ExpressionDetail;
}

export type ExpressionDetail = BaseNumerologyDetail;

export interface ChallengeData {
  [key: string]: ChallengeDetail;
}

export interface ChallengeDetail {
  description: string;
}

export interface SoulUrgeData {
  [key: string]: string[];
}

export interface PersonalityData {
  [key: string]: string[];
}

export interface BirthdayData {
  [key: string]: string[];
}

/**
 * Données personnelles du Nombre du Cœur (Heart Number) par nombre
 */
export interface HeartNumberPersonalDetail {
  essence: string;
  emotional_needs: string[];
  love_language: string;
  emotional_challenge: string;
}

export interface HeartNumberPersonalData {
  [numberKey: string]: HeartNumberPersonalDetail;
}

export interface RealisationNumberData {
  realisation_numbers: {
    [key: string]: RealisationNumberDetail;
  };
}

export type RealisationNumberDetail = BaseNumerologyDetail;

export interface LifeCycleData {
  [key: string]: LifeCycleDetail;
}

export type LifeCycleDetail = BaseCycleDetail;

export interface RealizationPeriodData {
  [key: string]: RealizationPeriodDetail;
}

export type RealizationPeriodDetail = BaseCycleDetail;

export interface PersonelCycleData {
  [key: string]: PersonelCycleDetail;
}

export type PersonelCycleDetail = BaseCycleDetail;

export interface KarmicNumberData {
  [key: string]: KarmicNumberDetail;
}

export interface KarmicNumberDetail {
  summary: string;
  challenge: string;
  details: string;
  keywords: string[];
}

export interface CycleKarmicData {
  [key: string]: CycleKarmicDetail;
}

export interface CycleKarmicDetail {
  summary: string;
  challenge: string;
  details: string;
  keywords: string[];
}

export interface KarmicDebtsData {
  [key: string]: KarmicDebtDetail;
}

export interface KarmicDebtDetail {
  summary: string;
  challenge: string;
  details: string;
  keywords: string[];
}

export interface BusinessNameData {
  [key: string]: BusinessNameDetail;
}

export interface BusinessNameDetail {
  archetype: string;
  summary: string;
  essence_vibration: string;
  favorable_for: string;
  unfavorable_for: string;
  ideal_industries: string[];
  strength: string;
  challenges: string[];
  alignment_tips: string;
  best_launch_dates: string;
  color_vibration: string;
}

export interface DateVibeData {
  [key: string]: DateVibeDetail;
}

export interface DateVibeDetail {
  summary: string;
  strength: string;
  challenge: string;
  favorable_for: string;
  unfavorable_for: string;
}

export interface ActifBusinessData {
  [key: string]: ActifBusinessDetail;
}

export interface ActifBusinessDetail {
  summary: string;
  mission: string;
  strengths: string[];
  challenges: string[];
}

export interface ExpressionBusinessData {
  [key: string]: ExpressionBusinessDetail;
}

export interface ExpressionBusinessDetail {
  summary: string;
  mission: string;
  strengths: string[];
  challenges: string[];
}

export interface HereditaryBusinessData {
  [key: string]: HereditaryBusinessDetail;
}

export interface HereditaryBusinessDetail {
  summary: string;
  mission: string;
  strengths: string[];
  challenges: string[];
}

export interface ComptaBusnessData {
  [combinationKey: string]: ComptaBusnessDetail;
}

export interface ComptaBusnessDetail {
  theme: string;
  vibration_alignment: string;
  core_message: string;
  energy_match: {
    expression_number: string;
    path_number: string;
  };
  business_strengths: string[];
  potential_challenges: string[];
  alignment_tips: string;
  launch_energy: {
    best_days: string[];
    avoid_days: string[];
    ideal_launch_vibe: string;
  };
  business_color: string;
  tagline: string;
}

export interface MatrixRelationsHeartData {
  interior: {
    [key: string]: string;
  };
  exterior: {
    [key: string]: string;
  };
}

export interface MatrixMoneyLoveData {
  love: {
    [key: string]: string;
  };
  money: {
    [key: string]: string;
  };
  pivot: {
    [key: string]: string;
  };
}

export interface ExternalRelationsData {
  pouvoir_social: {
    [key: string]: string;
  };
  influence_social: {
    [key: string]: string;
  };
}

// ===== INTERFACES MATRIX DESTINY =====

/**
 * Interface pour les données de base Matrix Destiny
 */
export interface BaseNumberDetail {
  mots_cles: string;
  description: string;
}

export interface BaseNumberData {
  jour: {
    [key: string]: BaseNumberDetail;
  };
  mois: {
    [key: string]: BaseNumberDetail;
  };
  annee: {
    [key: string]: BaseNumberDetail;
  };
  mission_vie: {
    [key: string]: BaseNumberDetail;
  };
}

/**
 * Interface pour les données de mission centrale Matrix Destiny
 */
export interface CentralMissionDetail {
  keyword: string;
  interpretation: string;
}

export interface CentralMissionData {
  central_balance: {
    [key: string]: CentralMissionDetail;
  };
}

/**
 * Interface pour les données de ligne féminine Matrix Destiny
 */
export interface FeminineLineDetail {
  keyword: string;
  interpretation: string;
}

export interface FeminineLineData {
  feminine_line: {
    spirit: {
      [key: string]: FeminineLineDetail;
    };
    heart: {
      [key: string]: FeminineLineDetail;
    };
    energy: {
      [key: string]: FeminineLineDetail;
    };
  };
}

/**
 * Interface pour les données de ligne masculine Matrix Destiny
 */
export interface MasculineLineDetail {
  keyword: string;
  interpretation: string;
}

export interface MasculineLineData {
  masculine_line: {
    spirit: {
      [key: string]: MasculineLineDetail;
    };
    heart: {
      [key: string]: MasculineLineDetail;
    };
    energy: {
      [key: string]: MasculineLineDetail;
    };
  };
}

// ===== INTERFACES ARBRE DE VIE =====

/**
 * Interface pour les données des Sephiroth de l'Arbre de Vie
 */
export interface SephiraMeaning {
  name: string;
  hebrewName: string;
  title: string;
  subtitle: string;
  description: string;
  domain: string;
}

export interface SephirothData {
  [key: string]: SephiraMeaning;
}

/**
 * Interface pour les interprétations personnalisées Sephira + Nombre
 */
export interface SephiraNumberMeaning {
  summary: string;
  description: string;
  keywords: string[];
  strengths: string;
  challenges: string;
  guidance: string;
}

export interface SephirothNumberData {
  [sephiraName: string]: {
    [numberKey: string]: SephiraNumberMeaning;
  };
}

/**
 * Interface pour les données des chemins de l'Arbre de Vie
 */
export interface PathMeaning {
  name: string;
  title: string;
  description: string;
  arcana: string;
  pillar: string;
}

export interface PathsData {
  [pathKey: string]: PathMeaning;
}

/**
 * Interface pour les interprétations personnalisées Chemin + Nombre
 */
export interface PathNumberMeaning {
  summary: string;
  description: string;
  keywords: string[];
  strengths: string;
  challenges: string;
  guidance: string;
}

export interface PathsNumberData {
  [pathKey: string]: {
    [numberKey: string]: PathNumberMeaning;
  };
}

// ===== INTERFACES COMPATIBILITÉ =====

/**
 * Interface pour les données de compatibilité amoureuse Life Path
 */
export interface LifePathLoveDetail {
  keywords: string[];
  description: string;
  strengths: string;
  challenges: string;
  advice: string;
}

export interface LifePathLoveData {
  [compatibilityKey: string]: LifePathLoveDetail;
}

/**
 * Interface pour les données de nombre d'union
 */
export interface UnionNumberDetail {
  title: string;
  keywords: string[];
  description: string;
  strengths: string;
  challenges: string;
  advice: string;
}

export interface UnionNumberData {
  [unionNumber: string]: UnionNumberDetail;
}

/**
 * Interface pour les dynamiques de compatibilité d'expression
 */
export interface ExpressionCompatibilityDynamic {
  how_they_connect: string;
  emotional_language: string;
  chemistry: string;
  growth_potential: string;
}

/**
 * Interface pour les données de compatibilité amoureuse basée sur les nombres d'expression
 */
export interface ExpressionNumberLoveDetail {
  relation_theme: string;
  vibration: string;
  connection_type: string;
  dynamic: ExpressionCompatibilityDynamic;
  strengths: string[];
  challenges: string[];
  tips_for_balance: string;
}

export interface ExpressionNumberLoveData {
  [compatibilityKey: string]: ExpressionNumberLoveDetail;
}

/**
 * Interface pour les données de compatibilité amoureuse basée sur le Nombre du Cœur
 */
export interface NumberHeartDetail {
  emotional_theme: string;
  connection_style: string;
  emotional_needs: {
    partner_1: string;
    partner_2: string;
  };
  strengths: string[];
  challenges: string[];
  growth_advice: string;
}

export interface NumberHeartData {
  [compatibilityKey: string]: NumberHeartDetail;
}

/**
 * Interface pour les données de compatibilité amicale basée sur le Life Path
 */
export interface LifePathFriendsDetail {
  title: string;
  relation_role: string;
  vibration: string;
  long_description: string;
  support: {
    [key: string]: string;
  };
  strengths: string[];
  challenge: string;
  growth_advice: string;
}

export interface LifePathFriendsData {
  [compatibilityKey: string]: LifePathFriendsDetail;
}

/**
 * Interface pour les ratings de compatibilité amicale basée sur les nombres d'expression
 */
export interface FriendshipVibeRating {
  fun: number;
  trust: number;
  deep_connection: number;
  adventure: number;
}

/**
 * Interface pour les données de compatibilité amicale basée sur les nombres d'expression
 */
export interface ExpressionNumberFriendsDetail {
  friendship_type: string;
  vibe: string;
  tagline: string;
  why_they_click: string[];
  what_they_love_doing: string[];
  friction_points: string[];
  friendship_superpower: string;
  friendship_vibe_rating: FriendshipVibeRating;
  best_activities: string[];
  anthem: string;
  keep_the_magic_alive: string;
}

export interface ExpressionNumberFriendsData {
  [compatibilityKey: string]: ExpressionNumberFriendsDetail;
}

/**
 * Interface pour les données de compatibilité amicale basée sur les Nombres de Personnalité
 */
export interface PersonalityNumberFriendsDetail {
  vibe_title: string;
  first_impression: string;
  social_chemistry: string[];
  what_connects_them: string[];
  potential_friction: string[];
  public_energy: string;
  ideal_contexts: string[];
  social_tip: string;
}

export interface PersonalityNumberFriendsData {
  [compatibilityKey: string]: PersonalityNumberFriendsDetail;
}

/**
 * Interface pour les dynamiques de travail
 */
export interface WorkDynamics {
  [key: string]: string;
}

/**
 * Interface pour les données de compatibilité professionnelle basée sur le Life Path
 */
export interface LifePathWorkDetail {
  duo_name: string;
  power_combo: string;
  work_dynamics: WorkDynamics;
  superpower: string;
  conflict_trigger: string;
  work_hack: string;
}

export interface LifePathWorkData {
  [compatibilityKey: string]: LifePathWorkDetail;
}

/**
 * Interface pour les dynamiques d'équipe
 */
export interface TeamDynamics {
  role_partner_1: string;
  role_partner_2: string;
  synergy: string;
}

/**
 * Interface pour les données de compatibilité professionnelle basée sur les nombres d'expression
 */
export interface ExpressionNumberWorkDetail {
  mission_title: string;
  work_chemistry: string[];
  team_dynamics: TeamDynamics;
  project_signature: string;
  risk_factors: string[];
  ideal_collaborations: string[];
  pro_tip: string;
}

export interface ExpressionNumberWorkData {
  [compatibilityKey: string]: ExpressionNumberWorkDetail;
}

/**
 * Interface pour les données de travail basées sur le Nombre d'Expression
 */
export interface ExpressionWorkDetail {
  career_archetype: string;
  core_talent: string;
  work_vibe: string;
  natural_strengths: string[];
  growth_zones: string[];
  ideal_roles: string[];
  motivation: string;
  career_tip: string;
}

export interface ExpressionWorkData {
  [numberKey: string]: ExpressionWorkDetail;
}

/**
 * Interface pour les données de travail basées sur le Nombre du Cœur
 */
export interface HeartNumberWorkDetail {
  title: string;
  inner_drive: string;
  emotional_needs: string[];
  work_meaning: string;
  shadow_fear: string;
  soul_advice: string;
}

export interface HeartNumberWorkData {
  [numberKey: string]: HeartNumberWorkDetail;
}

/**
 * Interface pour les données de travail basées sur le Life Path
 */
export interface PathLifeWorkDetail {
  title: string;
  mission_theme: string;
  essence: string;
  strengths: string[];
  challenges: string[];
  ideal_roles: string[];
  mantra: string;
}

export interface PathLifeWorkData {
  [numberKey: string]: PathLifeWorkDetail;
}

/**
 * Interface pour les données de fusion Année Universelle + Année Personnelle
 */
export interface YearFusionPersonalYearDetail {
  theme: string;
  travail_projets: string[];
  finances: string[];
  vie_interieure: string[];
  relations: string[];
  mots_cles: string[];
  conseils: string[];
  erreurs: string[];
  resume: string;
}

export interface YearFusionPersonalYears {
  [personalYearKey: string]: YearFusionPersonalYearDetail;
}

export interface YearFusionUniversalYearDetail {
  description: string;
  annees_personnelles: YearFusionPersonalYears;
}

export interface YearFusionData {
  [universalYearKey: string]: YearFusionUniversalYearDetail;
}

// ===== INTERFACES CRISTAUX =====

/**
 * Interface pour les propriétés d'une pierre dans une catégorie (amour, carriere, spiritualite)
 */
export interface CrystalStone {
  nom: string;
  proprietes: string;
  energie: string;
  objectif: string;
}

/**
 * Interface pour les pierres d'un chemin de vie (toutes catégories)
 */
export interface CrystalStones {
  amour: CrystalStone;
  carriere: CrystalStone;
  spiritualite: CrystalStone;
}

/**
 * Interface pour les données de cristaux d'un chemin de vie
 */
export interface CrystalPathDetail {
  chemin: string;
  description: string;
  pierres: CrystalStones;
}

/**
 * Type pour les données de cristaux (array de CrystalPathDetail)
 */
export type CrystalPathData = CrystalPathDetail[];

/**
 * Interface pour une pierre d'Expression
 */
export interface CrystalExpressionStone {
  nom: string;
  energie: string;
  objectif: string;
}

/**
 * Interface pour les données de cristaux basées sur le nombre d'Expression
 */
export interface CrystalExpressionDetail {
  nombre_expression: string;
  description: string;
  pierre: CrystalExpressionStone;
}

/**
 * Type pour les données de cristaux Expression (array de CrystalExpressionDetail)
 */
export type CrystalExpressionData = CrystalExpressionDetail[];

/**
 * Interface pour la pierre prioritaire dans la synthèse
 */
export interface CrystalSyntheseStone {
  nom: string;
  energie: string;
  objectif: string;
}

/**
 * Interface pour la synthèse de cristaux
 */
export interface CrystalSyntheseDetail {
  energie_dominante: string;
  objectif_global: string;
  pierre_prioritaire: CrystalSyntheseStone;
  message_cle: string;
}

// ===== INTERFACES VIBRATION DE LIEU =====

/**
 * Interface pour la vibration d'une adresse (numéro + voie).
 */
export interface VibrationAdresseDetail {
  nombre: number;
  mots_cles: string[];
  energie: string;
  ressenti: string;
  points_forts: string[];
  points_de_vigilance: string[];
  ideal_pour: string[];
  conseil: string;
  question_a_se_poser: string;
}

/**
 * Type pour les données de vibration d'adresse.
 */
export type VibrationAdresseData = VibrationAdresseDetail[];

/**
 * Interface pour la vibration d'une localité (code postal + ville).
 */
export interface VibrationLocaliteDetail {
  nombre: number;
  mots_cles: string[];
  energie: string;
  ressenti: string;
  opportunites: string[];
  defis: string[];
  profil_ideal: string[];
  conseil: string;
  question_a_se_poser: string;
}

/**
 * Type pour les données de vibration de localité.
 */
export type VibrationLocaliteData = VibrationLocaliteDetail[];

/**
 * Scoring d’une compatibilité chemin de vie × vibration d’adresse (lieu).
 */
export interface LifePathAddressCompatScoring {
  score_global: number;
  niveau: string;
  interpretation: string;
}

/**
 * Détail d’une compatibilité chemin de vie × vibration d’adresse.
 */
export interface LifePathAddressCompatDetail {
  chemin_de_vie: number;
  vibration_adresse: number;
  scoring: LifePathAddressCompatScoring;
  dynamique: string;
  lecture: string;
  forces: string[];
  defis: string[];
  conseil: string;
  actions_concretes: string[];
}

/**
 * Entrée JSON : objet avec clé `compatibilite`.
 */
export interface LifePathAddressCompatEntry {
  compatibilite: LifePathAddressCompatDetail;
}

export type LifePathAddressCompatData = LifePathAddressCompatEntry[];

/** Tonalité d’étiquette (classes CSS place-life-path-compat-label--*). */
export type LifePathAddressCompatLabelTone =
  | "harmonious"
  | "balanced"
  | "growth";

export const vibrationAdresseData =
  rawVibrationAdresseData as VibrationAdresseData;
export const vibrationLocaliteData =
  rawVibrationLocaliteData as VibrationLocaliteData;

export const lifePathAddressVibrationCompatData =
  rawLifePathAddressVibrationCompatData as LifePathAddressCompatData;

/**
 * Associe le libellé `niveau` du JSON à une tonalité pour les styles de carte.
 */
export function lifePathAddressCompatNiveauToTone(
  niveau: string
): LifePathAddressCompatLabelTone {
  const t = niveau.trim().toLowerCase();
  if (t.includes("très harmonieux") || t === "harmonieux") {
    return "harmonious";
  }
  if (t.includes("contraste") || t.includes("exigeant")) {
    return "growth";
  }
  return "balanced";
}

/**
 * Récupère la compatibilité détaillée chemin de vie × vibration d’adresse (numéro + voie).
 */
export function getLifePathAddressVibrationCompat(
  cheminDeVie: number,
  vibrationAdresse: number
): LifePathAddressCompatDetail | null {
  const row = lifePathAddressVibrationCompatData.find(
    (item) =>
      item.compatibilite.chemin_de_vie === cheminDeVie &&
      item.compatibilite.vibration_adresse === vibrationAdresse
  );
  return row?.compatibilite ?? null;
}

/**
 * Interface pour le profil de synthèse
 */
export interface CrystalSyntheseProfil {
  chemin_de_vie: number;
  nombre_expression: number;
  synthese: CrystalSyntheseDetail;
}

/**
 * Interface pour un élément de données de synthèse
 */
export interface CrystalSyntheseDataItem {
  profil_synthese: CrystalSyntheseProfil;
}

/**
 * Type pour les données de synthèse de cristaux (array de CrystalSyntheseDataItem)
 */
export type CrystalSyntheseData = CrystalSyntheseDataItem[];

// ===== ALIAS POUR COMPATIBILITÉ =====
export type ExpressionNumberData = ExpressionData;
export type ExpressionNumberDetail = ExpressionDetail;
export type ChallengeNumbersData = ChallengeData;
export type ChallengeNumberDetail = ChallengeDetail;
export type ActifBusinessNumberData = ActifBusinessData;
export type ActifBusinessNumberDetail = ActifBusinessDetail;
export type ExpressionBusinessNumberData = ExpressionBusinessData;
export type ExpressionBusinessNumberDetail = ExpressionBusinessDetail;
export type HereditaryBusinessNumberData = HereditaryBusinessData;
export type HereditaryBusinessNumberDetail = HereditaryBusinessDetail;
export type ComptaBusnessNumberData = ComptaBusnessData;
export type ComptaBusnessNumberDetail = ComptaBusnessDetail;
export type RealisationNumberDetailData = RealisationNumberData;
export type LifePathWorkDetailData = LifePathWorkData;
export type LifePathWorkDetailDetail = LifePathWorkDetail;
export type ExpressionNumberWorkDetailData = ExpressionNumberWorkData;
export type ExpressionNumberWorkDetailDetail = ExpressionNumberWorkDetail;

// ===== UTILITAIRES =====

/**
 * Liste de tous les chiffres numérologiques valides
 */
export const VALID_NUMEROLOGY_NUMBERS: NumerologyKey[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "11",
  "22",
  "33",
];

/**
 * Vérifie si un nombre est valide en numérologie
 */
export const isValidNumerologyNumber = (
  number: string
): number is NumerologyKey => {
  return VALID_NUMEROLOGY_NUMBERS.includes(number as NumerologyKey);
};

/**
 * Obtient les données pour un nombre spécifique avec vérification de sécurité
 */
export const getNumerologyData = <T>(
  data: { [key: string]: T },
  number: string
): T | null => {
  return isValidNumerologyNumber(number) ? data[number] || null : null;
};

/**
 * Récupère les données de réalisation pour un nombre donné
 * @param number - Le nombre de réalisation calculé (peut être n'importe quel nombre)
 * @returns RealisationNumberDetail | null - Les détails de réalisation ou null si non trouvé
 *
 * @example
 * const myRealisation = 29; // par ex. ton calcul numérologique
 * const data = getRealisationNumberData(myRealisation);
 * console.log(data?.title); // ➜ "Le Réalisateur Inspiré" (car 29 → 2+9 = 11, maître nombre)
 */
export const getRealisationNumberData = (
  number: number
): RealisationNumberDetail | null => {
  // Validation basique
  if (number < 0 || !Number.isInteger(number)) {
    return null;
  }

  // Réduire le nombre à un chiffre ou nombre maître
  const reducedNumber = reduceToSingleDigit(number);
  const numberKey = reducedNumber.toString();

  // Récupérer les données depuis la structure JSON
  const realisationData =
    realisationNumberData.realisation_numbers[
      numberKey as keyof typeof realisationNumberData.realisation_numbers
    ];

  return realisationData || null;
};

/**
 * Récupère les données de cristaux pour un chemin de vie donné
 * @param lifePathNumber - Le nombre du chemin de vie (peut être 1-9, 11, 22, ou 33)
 * @returns CrystalPathDetail | null - Les détails des cristaux ou null si non trouvé
 *
 * @example
 * const myLifePath = 5;
 * const crystals = getCrystalPathData(myLifePath);
 * console.log(crystals?.pierres.amour.nom); // ➜ "Turquoise"
 */
export const getCrystalPathData = (
  lifePathNumber: number
): CrystalPathDetail | null => {
  // Convertir le nombre en string pour la recherche
  const cheminKey = lifePathNumber.toString();

  // Rechercher dans les données
  const crystalData = crystalPathData.find(
    (item) => item.chemin === cheminKey
  );

  return crystalData || null;
};

/**
 * Récupère les données de cristaux pour un nombre d'Expression donné
 * @param expressionNumber - Le nombre d'Expression (peut être 1-9, 11, 22, ou 33)
 * @returns CrystalExpressionDetail | null - Les détails des cristaux ou null si non trouvé
 *
 * @example
 * const myExpression = 5;
 * const crystals = getCrystalExpressionData(myExpression);
 * console.log(crystals?.pierre.nom); // ➜ "Malachite"
 */
export const getCrystalExpressionData = (
  expressionNumber: number
): CrystalExpressionDetail | null => {
  // Convertir le nombre en string pour la recherche
  const expressionKey = expressionNumber.toString();

  // Rechercher dans les données
  const crystalData = crystalExpressionData.find(
    (item) => item.nombre_expression === expressionKey
  );

  return crystalData || null;
};

/**
 * Récupère les données de synthèse de cristaux pour une combinaison Chemin de Vie + Expression
 * @param lifePathNumber - Le nombre du Chemin de Vie (peut être 1-9, 11, 22, ou 33)
 * @param expressionNumber - Le nombre d'Expression (peut être 1-9, 11, 22, ou 33)
 * @returns CrystalSyntheseProfil | null - Le profil de synthèse ou null si non trouvé
 *
 * @example
 * const myLifePath = 5;
 * const myExpression = 3;
 * const synthese = getCrystalSyntheseData(myLifePath, myExpression);
 * console.log(synthese?.synthese.pierre_prioritaire.nom); // ➜ "Citrine"
 */
export const getCrystalSyntheseData = (
  lifePathNumber: number,
  expressionNumber: number
): CrystalSyntheseProfil | null => {
  // Rechercher dans les données
  const syntheseData = crystalSyntheseData.find(
    (item) =>
      item.profil_synthese.chemin_de_vie === lifePathNumber &&
      item.profil_synthese.nombre_expression === expressionNumber
  );

  return syntheseData?.profil_synthese || null;
};
