import {
  Text,
  Field,
  withDatasourceCheck,
  RichText as JssRichText,
  Image as JssImage,
  ImageField,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { ComponentProps } from 'lib/component-props';

type HeroBannerProps = ComponentProps & {
  fields: {
    title: Field<string>;
    description: Field<string>;
    image: ImageField;
  };
};

const HeroBanner = (props: HeroBannerProps): JSX.Element => (
  <div>
    <h1>
      <Text field={props?.fields?.title} />{' '}
    </h1>
    <p>
      <JssRichText field={props?.fields?.description} />
    </p>
    <JssImage className="img-fluid rounded-3 my-5" field={props?.fields?.image} />
  </div>
);

export default withDatasourceCheck()<HeroBannerProps>(HeroBanner);
