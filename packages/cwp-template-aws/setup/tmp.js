/*
#!/usr/bin/env node
const { red, green } = require("chalk");
const execa = require("execa");
const fs = require("fs-extra");
const Listr = require("listr");
const os = require("os");
const path = require("path");
const indentString = require("indent-string");
const fg = require("fast-glob");
const findUp = require("find-up");
const loadJsonFile = require("load-json-file");
const { sendEvent } = require("@webiny/tracking");
const writeJsonFile = require("write-json-file");
const rimraf = require("rimraf");
const getPackageVersion = require("./getPackageVersion");
const getPackageJson = require("./getPackageJson");
*/

/* {
            title: "Get proper package versions",
            task: async () => {
                // Set proper @webiny package versions
                const workspaces = await fg(["**!/package.json"], {
                    ignore: ["**!/dist/!**", "**!/node_modules/!**", root],
                    cwd: root
                });
                const latestVersion = await getPackageVersion("@webiny/cli", tag);

                for (let i = 0; i < workspaces.length; i++) {
                    const jsonPath = path.join(root, workspaces[i]);
                    const json = await loadJsonFile(jsonPath);
                    const keys = Object.keys(json.dependencies).filter(k =>
                        k.startsWith("@webiny")
                    );
                    const currentDir = jsonPath.match(/(.*)[\/\\]/)[1] || "";

                    const baseTsConfigPath = path
                        .relative(
                            currentDir,
                            findUp.sync("tsconfig.json", {
                                cwd: root
                            })
                        )
                        .replace(/\\/g, "/");

                    // We don't want to modify tsconfig file in the root of the project
                    if (workspaces[i] !== "package.json") {
                        const tsConfigPath = path.join(currentDir, "tsconfig.json");
                        const tsconfig = require(tsConfigPath);
                        tsconfig.extends = baseTsConfigPath;
                        fs.writeFileSync(tsConfigPath, JSON.stringify(tsconfig, null, 2));
                    }

                    keys.forEach(name => {
                        if (tag.startsWith(".")) {
                            // This means `tag` points to the location of all @webiny packages
                            json.dependencies[name] =
                                "link:" +
                                path.relative(
                                    path.dirname(jsonPath),
                                    path.join(process.cwd(), tag, name)
                                );
                        } else {
                            // Skip packages that are already set to use file: protocol
                            if (json.dependencies[name].startsWith("file:")) {
                                return;
                            }

                            // Use version of @webiny/cli package (we have fixed package versioning)
                            json.dependencies[name] = `^` + latestVersion;
                        }
                    });
                    await writeJsonFile(jsonPath, json);
                }
            }
        },
        {
            title: "Resolve packages",
            task: async () => {
                // Add package resolutions if `tag` is pointing to a local folder.

                // Why? This is very useful when you're testing packages that are not yet published to `npm`.
                // Just run `create-webiny-project my-project --tag=./local/webiny/project/node_modules` and the whole project
                // will be set up to use your local packages via symlinks, so you can develop and test immediately.
                try {
                    if (tag.startsWith(".")) {
                        const webinyPackages = await fg(["@webiny/!*"], {
                            cwd: path.join(process.cwd(), tag),
                            onlyDirectories: true
                        });

                        if (webinyPackages.length) {
                            const rootPkg = path.join(root, "package.json");
                            const rootPkgJson = await loadJsonFile(rootPkg);
                            if (!rootPkgJson.resolutions) {
                                rootPkgJson.resolutions = {};
                            }

                            webinyPackages
                                .filter(name => {
                                    // Do not include private packages
                                    const pkgJson = require(path.join(
                                        process.cwd(),
                                        tag,
                                        name,
                                        "package.json"
                                    ));
                                    return !pkgJson.private;
                                })
                                .forEach(name => {
                                    rootPkgJson.dependencies[name] = rootPkgJson.resolutions[name] =
                                        "link:" +
                                        path.relative(root, path.join(process.cwd(), tag, name));
                                });

                            await writeJsonFile(rootPkg, rootPkgJson);
                        }
                    }
                } catch (err) {
                    throw new Error("Unable to resolve packages: " + err.message);
                }
            }
        },*/
