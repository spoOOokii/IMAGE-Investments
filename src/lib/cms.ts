import {
  categories,
  companyProfile,
  faqs,
  locations,
  testimonials,
  trustPoints,
} from "@/lib/site-data";
import {
  getBlogPostBySlug as getManagedBlogPostBySlug,
  getPublishedBlogPosts,
} from "@/lib/admin-blog-store";
import { getVisiblePropertiesWithAdminStore } from "@/lib/admin-property-store";

export async function getCompanyProfile() {
  return companyProfile;
}

export async function getAllProperties() {
  return getVisiblePropertiesWithAdminStore();
}

export async function getFeaturedProperties() {
  const visibleProperties = await getVisiblePropertiesWithAdminStore();
  return visibleProperties.filter((property) => property.tags.includes("featured"));
}

export async function getFeaturedDeals() {
  const visibleProperties = await getVisiblePropertiesWithAdminStore();
  return visibleProperties.filter((property) => property.tags.includes("underMarket"));
}

export async function getPropertyBySlug(slug: string) {
  const visibleProperties = await getVisiblePropertiesWithAdminStore();
  return visibleProperties.find((property) => property.slug === slug);
}

export async function getRelatedProperties(slug: string, locationSlug: string) {
  const visibleProperties = await getVisiblePropertiesWithAdminStore();
  return visibleProperties
    .filter(
      (property) =>
        property.slug !== slug && property.locationSlug === locationSlug,
    )
    .slice(0, 3);
}

export async function getAllLocations() {
  return locations;
}

export async function getLocationBySlug(slug: string) {
  return locations.find((location) => location.slug === slug);
}

export async function getLocationProperties(slug: string) {
  const visibleProperties = await getVisiblePropertiesWithAdminStore();
  return visibleProperties.filter((property) => property.locationSlug === slug);
}

export async function getBlogPosts() {
  return getPublishedBlogPosts();
}

export async function getBlogPostBySlug(slug: string) {
  const post = await getManagedBlogPostBySlug(slug);
  return post && post.status === "published" ? post : null;
}

export async function getHomeCollections() {
  return {
    categories,
    testimonials,
    faqs,
    trustPoints,
  };
}
