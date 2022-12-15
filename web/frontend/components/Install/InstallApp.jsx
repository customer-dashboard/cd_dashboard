import {
    Page,
    Layout,
    Card,
    FormLayout,
    ButtonGroup,
    Button,
    TextStyle,
    SettingToggle,
    Link,
    Frame,
} from '@shopify/polaris';
import { useEffect, useState } from 'react';
import ToggleOn from "../../assets/image/ToggleOn.png"
import { useAuthenticatedFetch } from '../../hooks';
import SkeletonExample from '../SkeletonExample';
export function InstallApp(props) {
    const { shop } = props;
    const [state, setState] = useState([]);
    const [progress, setProgress] = useState(true)
    const fetch = useAuthenticatedFetch();
    useEffect(() => {
        getThemes();
    }, [])

    const getThemes = async () => {
        const getSetting = await fetch("/api/get-theme");
        const content = await getSetting.json();
        if (content.status === 200) {
            setState(content.data);
            setProgress(false);
        }
    }
    return (
        <Frame>
            {
                progress ?
                    <SkeletonExample /> :
                    <Page>
                        <Layout>
                            <Layout.AnnotatedSection
                                id="storeDetails"
                                title="Theme Installation"
                                description="Install and enable Customer Dashboard Pro in your Shop & Development Themes."
                            >
                    <Card sectioned >
                            <Layout>
                                    <Layout.Section oneThird>
                                            {
                                                state.map((ele, index) => {
                                                    if (ele.role === "main") {
                                                        return (
                                                            <FormLayout key={index}>
                                                                <p>Your current active shop theme is <TextStyle variation='strong'>{ele.name}</TextStyle></p>
                                                                <ButtonGroup>
                                                                    <Link removeUnderline url={`https://${shop}/admin/themes/${ele.id}/editor?context=apps`} external><Button>Manage Installation</Button></Link>
                                                                </ButtonGroup>
                                                            </FormLayout>
                                                        )
                                                    }
                                                })
                                            }
                                              </Layout.Section>
                                              <Layout.Section oneThird>
                                        <div>
                                            <img
                                                alt=""
                                                width="100%"
                                                height="100%"
                                                style={{
                                                    objectFit: 'cover',
                                                    objectPosition: 'center',
                                                }}
                                                src={ToggleOn}
                                            />
                                        </div>
                                    </Layout.Section>
                                </Layout>
                                        </Card>
                                                                        <Card sectioned>
                                    <FormLayout>
                                        <TextStyle variation='strong'>Install Customer Dashboard Pro on your themes</TextStyle>
                                        {
                                            state.map((ele, index) => {
                                                if (ele.role !== "main") {
                                                    return (
                                                        <SettingToggle key={index} action={{ content: <Link removeUnderline monochrome url={`https://${shop}/admin/themes/${ele.id}/editor?context=apps`} external>Manage Installation</Link> }} enabled="active">{ele.name}</SettingToggle>
                                                    )
                                                }
                                            })
                                        }
                                    </FormLayout>
                                </Card>
                            </Layout.AnnotatedSection>
                        </Layout>
                    </Page>
            }
        </Frame>
    );
}