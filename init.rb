require 'redmine'

class UncHelper
  def initialize
    @head = /^\\\\/
  end

  def is_unc?(str)
    (str =~ @head) != nil
  end

  def unc_to_file_proto(str)
    RAILS_DEFAULT_LOGGER.info "str == #{str}, is_unc? == #{is_unc?(str)}, head=#{@head.to_s}"
    return "" if !is_unc?(str)
    str.gsub(@head, "file://///").gsub(/\\/, "/")
  end
end

Redmine::Plugin.register :redmine_wiki_unc do
  name 'Redmine Wiki Unc plugin'
  author 'Takashi Oguma'
  description 'This is a plugin for macro of Redmine Wiki'
  version '0.0.2'

  Redmine::WikiFormatting::Macros.register do
    desc "make a link to UNC path.\n"
    macro :unc do |obj, args|
      h = UncHelper.new
      "<a href=\"#{h.unc_to_file_proto(args[0])}\">#{args}</a>"
    end
  end
end
