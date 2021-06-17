import "@emotion/core";
import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { parse } from "graphql/language";
import { pageAtom } from "@webiny/app-page-builder/editor/recoil/modules";
import { validation } from "@webiny/validation";
import { Typography } from "@webiny/ui/Typography";
import Accordion from "@webiny/app-page-builder/editor/plugins/elementSettings/components/Accordion";
import { HintInput } from "../../../components/HintInput";
import {
    ButtonContainer,
    SimpleButton
} from "@webiny/app-page-builder/editor/plugins/elementSettings/components/StyledComponents";
import { DynamicPageAtom } from "~/types";

const getItemsFromQuery = selections => {
    const items = [];
    for (const field of selections) {
        const name = field.name.value;
        const item = { key: name, children: [] };
        if (field.selectionSet) {
            item.children = getItemsFromQuery(field.selectionSet.selections);
        }
        items.push(item);
    }
    return items;
};

export const AdvancedSettings = ({ Bind, submit, data }) => {
    const pageAtomValue = useRecoilValue<DynamicPageAtom>(pageAtom);
    const pageDataSource = pageAtomValue.settings.dataSources.find(
        ds => ds.id === data.dataSource.id
    );

    const options = useMemo(() => {
        const ast = parse(pageDataSource.config.query);
        return getItemsFromQuery((ast.definitions[0] as any).selectionSet.selections);
    }, [data.id]);

    return (
        <Accordion title={"Data source"} defaultValue={true}>
            <>
                <Bind name={"dataSource.path"} validators={validation.create("required")}>
                    <HintInput
                        options={options}
                        element={data}
                        placeholder={"getArticle.data.content"}
                        description={"Enter a data source path"}
                    />
                </Bind>
                <ButtonContainer>
                    <SimpleButton onClick={submit}>
                        <Typography use={"caption"}>Save</Typography>
                    </SimpleButton>
                </ButtonContainer>
            </>
        </Accordion>
    );
};
