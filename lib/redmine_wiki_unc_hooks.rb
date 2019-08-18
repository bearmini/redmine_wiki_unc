class RedmineWikiUncHooks < Redmine::Hook::ViewListener
  render_on :view_layouts_base_html_head, :partial => "redmine_wiki_unc/redmine_wiki_unc_partial"
end