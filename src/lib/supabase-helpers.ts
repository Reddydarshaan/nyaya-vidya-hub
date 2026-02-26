import { supabase } from "@/integrations/supabase/client";

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(userId: string, updates: { name?: string; language_preference?: string }) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getChatHistory(userId: string) {
  const { data, error } = await supabase
    .from("chat_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function addChatEntry(userId: string, question: string, answer: string, sourceType: string, confidence: number) {
  const { data, error } = await supabase
    .from("chat_history")
    .insert({ user_id: userId, question, answer, source_type: sourceType, confidence })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getSimulatorScores(userId: string) {
  const { data, error } = await supabase
    .from("simulator_scores")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addSimulatorScore(userId: string, scenario: string, score: number, badge: string) {
  const { data, error } = await supabase
    .from("simulator_scores")
    .insert({ user_id: userId, scenario, score, badge })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function searchLegalQA(query: string) {
  const { data, error } = await supabase
    .from("legal_qa")
    .select("*");
  if (error) throw error;
  if (!data) return null;

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

  let bestMatch: typeof data[0] | null = null;
  let bestScore = 0;

  for (const qa of data) {
    let score = 0;
    const keywords = qa.keywords ?? [];
    for (const kw of keywords) {
      if (queryLower.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    for (const word of queryWords) {
      if (qa.question_english.toLowerCase().includes(word)) score += 1;
      if (qa.question_tamil.toLowerCase().includes(word)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = qa;
    }
  }

  const confidence = Math.min(bestScore / 6, 1) * 100;
  if (confidence > 30 && bestMatch) {
    return { match: bestMatch, confidence };
  }
  return null;
}
