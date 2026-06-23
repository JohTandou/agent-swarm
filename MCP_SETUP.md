# Configuration MCP pour OpenCode

Ce document explique comment configurer les serveurs MCP (Model Context Protocol) pour OpenCode.

## MCP Fonctionnels

### 1. Supabase MCP ✅
Permet de gérer les bases de données Supabase directement depuis OpenCode.

**Configuration requise :**
```bash
export SUPABASE_ACCESS_TOKEN="sbp_votre_token"
export SUPABASE_PROJECT_REF="votre_project_ref"
```

**Obtenir les credentials :**
1. Token : https://supabase.com/dashboard/account/tokens
2. Project Ref : Dans l'URL de votre projet (https://[REF].supabase.co)

### 2. Playwright MCP ✅
Permet de contrôler un navigateur pour les tests et l'automatisation.

**Aucune configuration requise** - Fonctionne automatiquement via npx.

### 3. 21st.dev Magic MCP ✅
Permet d'accéder à la bibliothèque de composants UI 21st.dev.

**Configuration requise :**
```bash
export MAGIC_21ST_API_KEY="votre_cle"
```

**Obtenir la clé :** https://21st.dev/settings/api-keys

### 4. Context7 MCP ✅
Permet d'accéder à la documentation des frameworks via Context7.

**Configuration requise :**
```bash
export CONTEXT7_API_KEY="votre_cle"
```

**Obtenir la clé :** https://context7.com/settings/api-keys

## Services sans MCP (API REST directe)

### Vercel
Pas de serveur MCP officiel. Utilisation via l'API REST avec curl.

```bash
export VERCEL_TOKEN="votre_token"
```

**Obtenir le token :** https://vercel.com/account/tokens

### Render
Pas de serveur MCP officiel. Utilisation via l'API REST avec curl.

```bash
export RENDER_API_KEY="votre_cle"
```

**Obtenir la clé :** https://dashboard.render.com/settings/api-keys

## Installation

1. Copiez le fichier example :
   ```bash
   cp ~/.config/opencode/.env.example ~/.config/opencode/.env
   ```

2. Remplissez les valeurs dans `.env`

3. Chargez les variables dans votre shell :
   ```bash
   source ~/.zshrc
   # ou
   source ~/.config/opencode/.env
   ```

4. Redémarrez OpenCode

## Vérification

Pour tester si les MCP fonctionnent :
```bash
# Test Supabase
npx -y @supabase/mcp-server-supabase@latest --help

# Test Playwright
npx -y @playwright/mcp@latest --help

# Test 21st.dev
npx -y @21st-dev/magic@latest --help
```

## Dépannage

**Problème :** "permission denied" ou "command not found"
**Solution :** Vérifiez que les variables d'environnement sont bien chargées avec `env | grep SUPABASE`

**Problème :** Les MCP ne répondent pas dans OpenCode
**Solution :** Redémarrez complètement OpenCode après avoir défini les variables
