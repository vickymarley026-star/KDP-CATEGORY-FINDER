import { db } from './index.ts';
import { savedBooks, savedAudits, savedCampaigns } from './schema.ts';
import { eq, desc, and } from 'drizzle-orm';
import { BookInput, CategoryAuditResult, APlusCampaign } from '../types/kdp.ts';

export async function saveUserBook(userId: number, book: BookInput) {
  try {
    const rows = await db
      .insert(savedBooks)
      .values({
        userId,
        title: book.title,
        subtitle: book.subtitle || null,
        authorName: book.authorName || null,
        asinOrIsbn: book.asinOrIsbn || null,
        format: book.format || 'ebook',
        primaryGenre: book.primaryGenre || null,
        subgenreTropes: book.subgenreTropes || null,
        blurb: book.blurb || null,
        currentCategories: JSON.stringify(book.currentCategories || []),
        backendKeywords: JSON.stringify(book.backendKeywords || []),
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Failed to save user book:', error);
    throw new Error('Database error saving book', { cause: error });
  }
}

export async function getUserBooks(userId: number) {
  try {
    return await db
      .select()
      .from(savedBooks)
      .where(eq(savedBooks.userId, userId))
      .orderBy(desc(savedBooks.updatedAt));
  } catch (error) {
    console.error('Failed to get user books:', error);
    throw new Error('Database error fetching books', { cause: error });
  }
}

export async function deleteUserBook(userId: number, bookId: number) {
  try {
    return await db
      .delete(savedBooks)
      .where(and(eq(savedBooks.id, bookId), eq(savedBooks.userId, userId)))
      .returning();
  } catch (error) {
    console.error('Failed to delete user book:', error);
    throw new Error('Database error deleting book', { cause: error });
  }
}

export async function saveUserAudit(userId: number, bookTitle: string, auditData: CategoryAuditResult, bookId?: number) {
  try {
    const rows = await db
      .insert(savedAudits)
      .values({
        userId,
        bookId: bookId || null,
        bookTitle,
        auditData: JSON.stringify(auditData),
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Failed to save audit result:', error);
    throw new Error('Database error saving audit', { cause: error });
  }
}

export async function getUserAudits(userId: number) {
  try {
    return await db
      .select()
      .from(savedAudits)
      .where(eq(savedAudits.userId, userId))
      .orderBy(desc(savedAudits.createdAt))
      .limit(20);
  } catch (error) {
    console.error('Failed to get user audits:', error);
    throw new Error('Database error fetching audits', { cause: error });
  }
}

export async function saveUserCampaign(userId: number, campaignTitle: string, campaignData: APlusCampaign, bookId?: number) {
  try {
    const rows = await db
      .insert(savedCampaigns)
      .values({
        userId,
        bookId: bookId || null,
        campaignTitle,
        campaignData: JSON.stringify(campaignData),
      })
      .returning();
    return rows[0];
  } catch (error) {
    console.error('Failed to save A+ campaign:', error);
    throw new Error('Database error saving campaign', { cause: error });
  }
}

export async function getUserCampaigns(userId: number) {
  try {
    return await db
      .select()
      .from(savedCampaigns)
      .where(eq(savedCampaigns.userId, userId))
      .orderBy(desc(savedCampaigns.updatedAt))
      .limit(20);
  } catch (error) {
    console.error('Failed to get user campaigns:', error);
    throw new Error('Database error fetching campaigns', { cause: error });
  }
}
