First retrieve the list of recently modified files via git diff --name-only HEAD~1.
Pass this list to the @writer agent as context to update all documentation now, without waiting for a commit.
