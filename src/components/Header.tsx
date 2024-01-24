import {
  withDatasourceCheck,
  Field,
  LinkField,
  Link as JssLink,
  Image as JssImage,
  ImageField,
  Text,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';
interface subNavListModel {
  name: string;
  fields: {
    hyperLink: LinkField;
    title: Field<string>;
  };
}

interface navListModel {
  name: string;
  fields: {
    categoryName: Field<string>;
    hyperLink: LinkField;
    items: subNavListModel[];
  };
}
type HeaderProps = ComponentProps & {
  fields: {
    logo: ImageField;
    logoLink: LinkField;
    items: navListModel[];
  };
};
const Header = ({ fields }: HeaderProps): JSX.Element => (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <div className="container px-5">
      <JssLink field={fields?.logoLink}>
        <JssImage field={fields?.logo} />
      </JssLink>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          {fields?.items?.map((navItem: navListModel) => (
            <li className={`nav-item ${navItem?.fields?.items?.length > 1 ? 'dropdown' : ''}`}>
              <JssLink
                field={navItem?.fields?.hyperLink}
                className={`nav-link ${
                  navItem?.fields?.items?.length > 1 ? 'nav-link dropdown-toggle' : ''
                }`}
              >
                <Text tag="span" field={navItem?.fields?.categoryName} />
              </JssLink>
              {navItem?.fields?.items?.length > 1 && (
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="navbarDropdownBlog"
                >
                  {navItem.fields.items &&
                    navItem.fields?.items?.map((subNavItem: subNavListModel) => (
                      <li>
                        <JssLink field={subNavItem?.fields?.hyperLink} className="dropdown-item">
                        </JssLink>
                      </li>
                    ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </nav>
);

export default withDatasourceCheck()<HeaderProps>(Header);
